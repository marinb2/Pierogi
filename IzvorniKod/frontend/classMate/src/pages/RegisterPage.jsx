import logo from "../assets/logo.svg";
import '../styles/RegisterPage.css';
import React, { act, useEffect, useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { styled } from '@mui/material/styles';
import PropTypes, { bool } from 'prop-types';
const StyledStepLabel = styled(StepLabel)(() => ({
    "& .MuiStepIcon-root.Mui-active": {
        color: 'rgba(103, 58, 183, 1)',
    },
    "& .MuiStepIcon-root.Mui-completed": {
        color: 'rgba(103, 58, 183, 1)',
    }
}));



const steps = ['Odabir uloge', 'Odabir škole', 'Informacije o ulozi'];
// Placeholder data za formu, kasnije će se dohvaćati iz baze i uvjetno prikazivati ovisno o odabiru korisnika
const stepData = [
    {
        label: 'Uloga',
        value: 'role',
        options: [
            { value: '', label: 'Odaberite ulogu', disabled: true, id: -1 },
            { value: "učenik", label: 'Učenik', id: 1 },
            { value: "nastavnik", label: 'Nastavnik', id: 2 },
        ],
    },
    {
        label: 'Škola',
        value: 'school',
        options: [
            { value: '', label: 'Odaberite školu', disabled: true, id: -1 },
            /* { value: 'XV. gimnazija', label: 'XV. gimnazija', id: 1000 },
            { value: 'Prirodoslovna škola Vladimira Preloga', label: 'Prirodoslovna škola Vladimira Preloga', id: 1001 },
            { value: 'I. gimnazija', label: 'I. gimnazija', id: 1002 },
            { value: 'Tehnička škola Ruđera Boškovića', label: 'Tehnička škola Ruđera Boškovića', id: 1003 }, */
        ],
    },
    {
        label: 'Smjer',
        value: 'major',
        options: [
            { value: '', label: 'Odaberite smjer', disabled: true, id: -1 },
            /* { value: "Kemijski tehničar", label: 'Kemijski tehničar', id: 1000 },
            { value: "Matematika", label: 'Matematika', id: 1001 },
            { value: 'Fizika', label: 'Fizika', id: 1002 },
            { value: 'Računarstvo', label: 'Računarstvo', id: 1003 }, */
        ],
    },
    {
        label: 'Predmet',
        value: 'subject',
        options: [
            { value: '', label: 'Odaberite predmet', disabled: true, id: -1 },
            /* { value: "math", label: 'Matematika', id: 1000 },
            { value: "physics", label: 'Fizika', id: 1001 },
            { value: "chemistry", label: 'Kemija', id: 1002 }, */
        ],
    }
];
const SelectField = ({ label, value, onChange, options }) => {
    return (
        <Box sx={{ minWidth: 120, margin: '35px 8px' }}>
            <FormControl fullWidth>
                <InputLabel id={`${label}-select-label`} shrink sx={{ backgroundColor: 'white', pr: '5px', pl: '5px' }}>
                    {label}
                </InputLabel>
                <Select
                    labelId={`${label}-select-label`}
                    id={`${label}-select`}
                    value={value}
                    onChange={onChange}
                    displayEmpty
                    sx={{ textAlign: 'left' }}
                >
                    {options.map(option => (
                        <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};
SelectField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
            disabled: PropTypes.bool
        })
    ).isRequired
};
function RegisterPage() {
    //const frontdomain = "http://localhost:3000"
    const frontdomain = "https://pierogi-theta.vercel.app/"
    //const backdomain = "http://localhost:8080"
    const backdomain = "https://pierogi2-1m4p.onrender.com"
    const [forceRerender, setForceRerender] = useState(0);
    const [activeStep, setActiveStep] = React.useState(0);
    const [userDetails, setUserDetails] = useState("");
    const [users, setUsers] = useState(null);
    const [schools, setSchools] = useState(null);
    const [subjects, setSubjects] = useState(null);
    const [majors, setMajors] = useState(null);
    const [formData, setFormData] = React.useState({
        role: '',
        school: '',
        major: '',
        subject: ''
    });
    var username = sessionStorage.getItem("userName");
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleReset = () => {
        setActiveStep(0);
    };
    const handleChange = (event, field) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: event.target.value,
        }));
    };



    const getUsers = async () => {
        try {
            const response = await fetch(`${backdomain}/api/users`, { method: "GET", credentials: "include" });
            if (response) {

                const usersjson = await response.json();
                setUsers(usersjson);

            }
        } catch (error) {
            console.log(error);
        }
    }
    const getSchools = async () => {
        try {
            const response = await fetch(`${backdomain}/api/schools`, { method: "GET", credentials: "include" });
            if (response) {

                const schoolsjson = await response.json();
                setSchools(schoolsjson);

            }
        } catch (error) {
            console.log(error);
        }
    }
    const getSubjects = async () => {
        try {
            const response = await fetch(`${backdomain}/api/subjects`, { method: "GET", credentials: "include" });
            if (response) {

                const subjectsjson = await response.json();
                setSubjects(subjectsjson);

            }
        } catch (error) {
            console.log(error);
        }
    }
    const getMajors = async () => {
        try {
            const response = await fetch(`${backdomain}/api/programmes`, { method: "GET", credentials: "include" });
            if (response) {

                const majorsjson = await response.json();
                setMajors(majorsjson);

            }
        } catch (error) {
            console.log(error);
        }
    }

    const registerUser = async (user, role) => {
        try {
            if (role == "učenik") {
                await fetch(`${backdomain}/api/users`, {
                    method: "post", credentials: "include",
                    headers: {
                        "Content-Type": "Application/json"
                    },
                    body: JSON.stringify({
                        created_at: new Date(),
                        email: userDetails,
                        username: transformUserName(username),
                        pfpUrl: sessionStorage.getItem("userPfpUrl"),
                        role: {
                            "roleId": 1,
                            "roleName": "ucenik"
                        },
                        programme: user.major,
                        school: user.school,

                    })
                }).then(() => {
                    window.location.href = `${frontdomain}/main`
                });

            } else if (role == "nastavnik") {
                await fetch(`${backdomain}/api/users`, {
                    method: "post", credentials: "include",
                    headers: {
                        "Content-Type": "Application/json"
                    },
                    body: JSON.stringify({
                        created_at: new Date(),
                        email: userDetails,
                        username: transformUserName(username),
                        pfpUrl: sessionStorage.getItem("userPfpUrl"),
                        role: {
                            "roleId": 2,
                            "roleName": "nastavnik"
                        },
                        subject: user.subject,
                        school: user.school
                    })
                }).then(() => {
                    window.location.href = `${frontdomain}/main`;
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    function transformUserName(input) {

        input = input.replace("č", "c")
        input = input.replace("ć", "c")
        input = input.replace("š", "s")
        input = input.replace("đ", "d")
        input = input.replace("ž", "z")
        return input;
    }

    useEffect(() => {
        if (userDetails && users)
            for (var i = 0; i < users.length; i++) {
                if (users[i].email == userDetails) {
                    window.location.href = `${frontdomain}/main`
                }
            }

    }, [userDetails, users]);

    useEffect(() => {
        if (activeStep === 1) {
            if (schools) {
                for (var i = 0; i < schools.length; i++) {
                    stepData[1].options.push({
                        id: schools[i].id,
                        label: schools[i].name,
                        value: schools[i].name
                    })
                }
                setForceRerender(1);
            }
        }
    }, [activeStep, schools])

    useEffect(() => {

        if (activeStep === 2) {
            if (majors) {
                for (var i = 0; i < majors.length; i++) {
                    if (majors[i].school.name === formData.school) {
                        stepData[2].options.push({
                            id: majors[i].programmeId,
                            label: majors[i].programName,
                            value: majors[i].programName
                        })
                    }
                }
                setForceRerender(2);
            }
        }

    }, [activeStep, majors])

    useEffect(() => {
        if (activeStep === 2) {
            if (subjects) {
                for (var i = 0; i < subjects.length; i++) {
                    if (subjects[i].programme.school.name === formData.school) {
                        stepData[3].options.push({
                            id: subjects[i].subjectId,
                            label: subjects[i].subjectName,
                            value: subjects[i].subjectName
                        })
                    }
                }
                setForceRerender(3);
            }
        }

    }, [activeStep, subjects])



    useEffect(() => {
        if (activeStep === 0) {
            setUserDetails(sessionStorage.getItem("loggedInUserEmail"));
            getUsers();
        } else if (activeStep === 1) {
            getSchools();
        } else if (activeStep === 2) {
            if (formData.role === "nastavnik") {
                getSubjects();
            } else if (formData.role === "učenik") {
                getMajors();
            }
        } else if (activeStep === 3) {
            var school;
            var major;
            if (formData.role == "učenik") {
                for (var i = 0; i < schools.length; i++) {
                    if (formData.school == schools[i].name) {
                        school = schools[i];
                        break;
                    }
                }
                for (var i = 0; i < majors.length; i++) {
                    if (formData.major == majors[i].programName) {
                        major = majors[i];
                        break;
                    }
                }
                var user = { school: school, major: major }
                registerUser(user, formData.role)
            } else if (formData.role == "nastavnik") {
                for (var i = 0; i < schools.length; i++) {
                    if (formData.school == schools[i].name) {
                        var school = schools[i];
                        break;
                    }
                }
                for (var i = 0; i < subjects.length; i++) {
                    if (formData.subject == subjects[i].subjectName) {
                        var subject = subjects[i];
                        break;
                    }
                }
                registerUser({ school: school, subject: subject }, formData.role)
            }
        }
    }, [activeStep]);
    // Funkcija koja ovisno o trenutnom koraku prikazuje odgovarajući dio forme, kasnije će se selektirane vrijednosti spremiti u bazu
    const renderFormContent = () => {
        const currentStepData = stepData[activeStep];
        if (activeStep === 2) {
            if (formData.role === "učenik") {
                return (
                    <SelectField
                        label="Smjer"
                        value={formData.major}
                        onChange={(e) => handleChange(e, 'major')}
                        options={stepData[2].options}
                    />
                );
            }
            if (formData.role === "nastavnik") {
                return (
                    <SelectField
                        label="Predmet"
                        value={formData.subject}
                        onChange={(e) => handleChange(e, 'subject')}
                        options={stepData[3].options}
                    />
                );
            }
        }
        return (
            <SelectField
                label={currentStepData.label}
                value={formData[currentStepData.value]}
                onChange={(e) => handleChange(e, currentStepData.value)}
                options={currentStepData.options}
            />
        );
    };
    return (
        <div className="landing-page">
            <img src={logo} className="logo" alt="Logo" />
            <Box sx={{ width: '100%', maxWidth: '700px', mb: 50 }}>
                <Stepper alternativeLabel activeStep={activeStep} sx={{ maxWidth: '570px', mx: 'auto' }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StyledStepLabel>{label}</StyledStepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div className="form-div">
                    {/* Reset gumb stavljen samo zato da se ne mora refreshat stranica svaki put nego da se lagano testira kod, kasnije će se maknuti */}
                    {activeStep === steps.length ? (
                        <React.Fragment>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button onClick={handleReset} variant="contained" sx={{ backgroundColor: 'rgba(103, 58, 183, 1)', width: '150px' }}>
                                    Reset
                                </Button>
                            </Box>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1, fontSize: '25px', textAlign: 'left', marginLeft: '8px', marginRight: '8px', borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}>
                                Postavljanje profila
                            </Typography>
                            {renderFormContent()}
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1, width: '150px', color: 'rgba(103, 58, 183, 1)', borderColor: 'rgba(103, 58, 183, 1)', marginLeft: '8px', border: '1px solid' }}
                                    startIcon={<ChevronLeftIcon />}
                                >
                                    Nazad
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                {/* Za sada registriraj se nema funkcionalnost, samo vodi do Reset gumba, kasnije će morati imati mogućnost završavanja forme i slanja podataka bazi */}
                                <Button onClick={handleNext} variant="contained" sx={{ backgroundColor: 'rgba(103, 58, 183, 1)', width: 'auto', flex: '10', marginRight: '8px' }} endIcon={activeStep !== steps.length - 1 && <ChevronRightIcon />}>
                                    {activeStep === steps.length - 1 ? 'Registriraj se' : 'Nastavi'}
                                </Button>
                            </Box>
                        </React.Fragment>
                    )}
                </div>
            </Box>
        </div>
    );
}
export default RegisterPage;