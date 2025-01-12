import { useEffect, useState, useMemo } from 'react';
import Sidebar from "./MainPage";
import { db, storage } from "../config/Firebase";
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { Timestamp, getDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore'; // Import Firestore Timestamp

function MaterialsPage() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadedFileRef, setUploadedFileRef] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [materials, setMaterials] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState(null);

  const backdomain = "http://localhost:8080";
  const userMail = sessionStorage.getItem("loggedInUserEmail");

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`${backdomain}/api/users/getByEmail?email=${userMail}`, { method: "GET", credentials: "include" });
        if (response) {
          const userJSON = await response.json();
          //console.log('Fetched User:', userJSON);
          setUser(userJSON);
        }
      }
      catch (error) {
        console.error(error);
      }
    }
    if (userMail) {
      getUser();
    } else {
      //console.log("No logged-in user email found.");
    }
  }, [userMail]);

  const role = user ? user[0]?.role?.roleName : null;

  const materialsCollection = useMemo(() => collection(db, "materials"), []);

  const storageRef = useMemo(() => {
    return file ? ref(storage, 'files/' + file.name) : null;
  }, [file]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxFileSize = 100 * 1024 * 1024; // 100 MB limit
      if (file.size > maxFileSize) {
        alert("File size exceeds 100 MB limit.");
        return;
      }
      setFile(file);
    }
  };

  const handleUpload = () => {
    if (!file || !storageRef) return;

    setIsUploading(true); // Set uploading state to true

    // Upload the file to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Monitor upload progress
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        setIsUploading(false); // Set uploading state to false on error
      },
      () => {
        // Get the download URL after the file is successfully uploaded
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Extract the base URL from the download URL (remove the token part)
          const baseUrl = downloadURL.split('?')[0] + '?alt=media';

          // Save the URL to localStorage (or sessionStorage)
          localStorage.setItem('uploadedFileURL', baseUrl); // Save in localStorage

          // Set the file URL in state to display the file link
          setFileUrl(baseUrl);

          // Set the reference to the uploaded file for deletion later
          setUploadedFileRef(uploadTask.snapshot.ref);

          const uploadedBy = user ? user[0]?.email : "unknown user";
          const subject = user ? user[0]?.subject?.subjectName : "unknown subject";
          const school = user ? user[0]?.school.name : "unknown school";
          const programme = role === "nastavnik" ? user[0]?.subject?.programme?.programName : user[0]?.programme?.programName;

          // Save the file metadata (name, size, and date) to Firestore
          const fileMetadata = {
            name: file.name,
            size: file.size,
            date: Timestamp.fromDate(new Date()), // Store date as Firestore Timestamp
            url: baseUrl, // Store the base URL (without token)
            uploadedBy: uploadedBy,
            subject: subject,
            school: school,
            programme: programme,
            viewedBy: [],
          };

          //console.log("fileMetadata being added to Firestore:", fileMetadata);

          // Save file metadata to Firestore and capture the docRef.id (materialId)
          addDoc(materialsCollection, fileMetadata)
            .then((docRef) => {
              // After uploading, store the material ID (docRef.id)
              const materialId = docRef.id;
              //console.log("File uploaded with ID:", materialId);
              //console.log("Successfully added to Firestore:", docRef.id);

              // Add the new material to the state with its materialId
              /*setMaterials((prevMaterials) => [
                ...prevMaterials,
                {
                  ...fileMetadata,
                  id: materialId, // Save the materialId (Firestore document ID)
                  date: fileMetadata.date.toDate().toLocaleDateString('hr-HR'),
                },
              ]);*/
            })
            .catch((error) => {
              console.error("Error saving metadata to Firestore:", error);
            })
            .finally(() => {
              setIsUploading(false); // Set uploading state to false after operation completes
            });
        }).catch((error) => {
          console.error("Error getting download URL:", error);
          setIsUploading(false); // Set uploading state to false on error
        });
      }
    );
  };

  const handleViewFile = async (materialId) => {
    try {
      const studentEmail = user[0]?.email; // Current student's email
      if (!studentEmail) {
        console.error("No student email found.");
        return;
      }

      const materialDocRef = doc(db, "materials", materialId);

      // Get the current material document
      const materialDoc = await getDoc(materialDocRef);
      if (materialDoc.exists()) {
        const materialData = materialDoc.data();
        const { viewedBy = [] } = materialData;

        // Check if the student has already viewed the file
        if (!viewedBy.includes(studentEmail)) {
          // Add the student's email to the viewedBy array
          await updateDoc(materialDocRef, {
            viewedBy: arrayUnion(studentEmail), // Use arrayUnion for safe updates
          });
          //console.log(`Added ${studentEmail} to viewedBy for material ${materialId}`);
        }
      }
    } catch (error) {
      console.error("Error updating viewedBy:", error);
    }
  };



  const handleDeleteMaterial = (materialId, materialUrl) => {
    if (!materialId) {
      console.error("Material ID is undefined or null.");
      return;
    }

    // Extract the file path correctly by removing everything before '/o/' and the '?alt=media' part
    const filePath = materialUrl.split('/o/')[1].split('?')[0];

    // Decode the path to handle any special characters like spaces
    const decodedPath = decodeURIComponent(filePath);

    // Log to verify the extracted path
    //console.log("Deleting file at path:", decodedPath);

    if (!decodedPath) {
      console.error("File path extraction failed.");
      return;
    }

    // Create a reference to the file in Firebase Storage using the correct file path
    const materialRef = ref(storage, decodedPath);

    // Delete the file from storage
    deleteObject(materialRef)
      .then(() => {
        //console.log("File deleted from storage");

        // Create a reference to the document in Firestore
        const materialDocRef = doc(db, "materials", materialId);

        // Delete the document from Firestore
        deleteDoc(materialDocRef)
          .then(() => {
            //console.log("Material document deleted from Firestore");

            // Remove the material from the state to reflect the deletion
            setMaterials((prevMaterials) =>
              prevMaterials.filter((material) => material.id !== materialId)
            );
          })
          .catch((error) => {
            console.error("Error deleting material document from Firestore:", error);
          });
      })
      .catch((error) => {
        console.error("Error deleting file from storage:", error);
      });
  };

  // Load the file URL from sessionStorage when the page loads
  useEffect(() => {
    const storedUrl = localStorage.getItem('uploadedFileURL');  // or use localStorage
    if (storedUrl) {
      setFileUrl(storedUrl);  // Restore the URL if it exists
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(materialsCollection, (snapshot) => {
      const updatedMaterials = snapshot.docs.map((doc) => {
        const data = doc.data();
        const formattedDate = data.date
          ? data.date.toDate().toLocaleDateString('hr-HR')
          : 'No Date';

        return {
          ...data,
          id: doc.id,
          date: formattedDate,
        };
      });

      setMaterials(updatedMaterials);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [materialsCollection]);


  // Logic to filter materials based on role
  const filteredMaterials = useMemo(() => {
    if (!role || !materials.length) return [];

    if (role === "nastavnik") {
      // Filter materials uploaded by the teacher (uploadedBy = user email)
      return materials.filter(material => material.uploadedBy === user[0]?.email);
    }

    if (role === "ucenik") {
      // Filter materials for students based on school and programme
      return materials.filter(
        material => material.school === user[0]?.school.name && material.programme === user[0]?.programme?.programName
      );
    }

    return materials;
  }, [role, materials, user]);


  // Group materials by subject for students
  const groupedMaterials = useMemo(() => {
    if (role !== "ucenik") return [];

    return filteredMaterials.reduce((acc, material) => {
      const subject = material.subject || "Unknown Subject";
      if (!acc[subject]) acc[subject] = [];
      acc[subject].push(material);
      return acc;
    }, {});
  }, [role, filteredMaterials]);

  // Function to format file size in a user-friendly way (KB, MB, GB)
  const formatFileSize = (size) => {
    if (size < 1024) return size + " bytes";
    if (size < 1048576) return (size / 1024).toFixed(2) + " KB";
    if (size < 1073741824) return (size / 1048576).toFixed(2) + " MB";
    return (size / 1073741824).toFixed(2) + " GB";
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {role === "nastavnik" && (
          <div>
            <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Upload file</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={isUploading}>Upload</button>
            {progress > 0 && <p>Upload Progress: {Math.round(progress)}%</p>}
          </div>
        )}
      </div>

      <div>
        {role === "ucenik" && Object.keys(groupedMaterials).length > 0 && (
          Object.keys(groupedMaterials).map((subject) => (
            <div key={subject}>
              <h2>{subject}</h2>
              {groupedMaterials[subject].map((material) => (
                <div key={material.id}>
                  <h3>{material.name}</h3>
                  <p>{material.date}</p>
                  <p>{formatFileSize(material.size)}</p>
                  <p>
                    <a href={material.url} target="_blank" rel="noopener noreferrer" onClick={() => handleViewFile(material.id)}>View File</a>
                  </p>
                </div>
              ))}
            </div>
          ))
        )}

        {role === "nastavnik" && filteredMaterials.length > 0 && (
          filteredMaterials.map((material) => (
            <div key={material.id}>
              <h3>{material.name}</h3>
              <p>{material.date}</p>
              <p>{formatFileSize(material.size)}</p>
              <p>
                <a href={material.url} target="_blank" rel="noopener noreferrer">View File</a>
              </p>
              <p>Viewed by: {material.viewedBy?.length || 0} students</p>
              <button onClick={() => handleDeleteMaterial(material.id, material.url)}>
                Delete
              </button>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default MaterialsPage;