import logo from "../assets/logo.svg";
import '../styles/RegisterPage.css';
import React, { act, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

var ran_once = false;
var programmes_updated = false;
var subjects_updated = false;

const StyledStepLabel = styled(StepLabel)(() => ({
    "& .MuiStepIcon-root.Mui-active": {
        color: 'rgba(103, 58, 183, 1)',
    },
    "& .MuiStepIcon-root.Mui-completed": {
        color: 'rgba(103, 58, 183, 1)',
    }
}));

// Placeholder data za formu, kasnije će se dohvaćati iz baze i uvjetno prikazivati ovisno o odabiru korisnika
const stepData = [
    {
        label: 'Uloga',
        value: 'role',
        options: [
            { value: '', label: 'Odaberite ulogu', disabled: true },
            { value: "ucenik", label: 'Učenik' },
            { value: "nastavnik", label: 'Nastavnik' },
        ],
    },
    {
        label: 'Škola',
        value: 'school',
        options: [
            { value: '', label: 'Odaberite školu', disabled: true },
            { value: 'XV. gimnazija', label: 'XV. gimnazija' },
            { value: 'Prirodoslovna škola Vladimira Preloga', label: 'Prirodoslovna škola Vladimira Preloga' },
            { value: 'I. gimnazija', label: 'I. gimnazija' },
            { value: 'Tehnička škola Ruđera Boškovića', label: 'Tehnička škola Ruđera Boškovića' },
        ],
    },
    {
        label: 'Smjer',
        value: 'major',
        options: [
            { value: '', label: 'Odaberite smjer', disabled: true },
            { value: "Kemijski tehničar", label: 'Kemijski tehničar' },
            { value: "Matematika", label: 'Matematika' },
            { value: 'Fizika', label: 'Fizika' },
            { value: 'Računarstvo', label: 'Računarstvo' },
        ],
    },
    {
        label: 'Predmet',
        value: 'subject',
        options: [
            { value: '', label: 'Odaberite predmet', disabled: true },
            { value: "math", label: 'Matematika' },
            { value: "physics", label: 'Fizika' },
            { value: "chemistry", label: 'Kemija' },
        ],
    }
];

const steps = ['Odabir uloge', 'Odabir škole', 'Informacije o ulozi'];

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

    const [value, setValue] = React.useState(0);


    useEffect(() => {


        if (!ran_once) {
            ran_once = true;
            fetch("https://classmate-iu0n.onrender.com/auth/details/currentuser", {
                credentials: "include",
                method: "GET"
            }).then(res => res.json()).then(authdata => {
                fetch("https://classmate-iu0n.onrender.com/api/users", {
                    credentials: "include",
                    method: "GET"
                }).then(res => res.json()).then(userdata => {
                    for (var i = 0; i < userdata.length; i++) {
                        if (userdata[i].email == authdata.email)
                            window.location.href = "https://pierogi-alpha.vercel.app/main";
                    }
                    fetch("https://classmate-iu0n.onrender.com/api/schools",
                        {
                            credentials: "include",
                            method: "GET",
                        }
                    ).then(res => res.json())
                        .then(data => {
                            console.log(data);
                            for (var i = 0; i < data.length; i++) {
                                stepData[1].options.push(
                                    {
                                        value: data[i].name,
                                        label: data[i].name
                                    })
                            }
                        });
                })



            })
        }
    }, []);


    const [activeStep, setActiveStep] = React.useState(0);
    const [formData, setFormData] = React.useState({
        role: '',
        school: '',
        major: '',
        subject: ''
    });

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);


        if (activeStep == 0) {
            console.log("zero");
            console.log(formData);
        } else if (activeStep == 1) {
            console.log("one");
            console.log(formData);
        } else if (activeStep == 2) {
            console.log("two");
            console.log(formData);
            window.location.href = "https://pierogi-alpha.vercel.app/main";
            fetch("https://classmate-iu0n.onrender.com/auth/details/currentuser", {
                credentials: "include"
            }).then(res => res.json()).then(authdata => {
                fetch("https://classmate-iu0n.onrender.com/api/schools", {
                    credentials: "include"
                }).then(res => res.json()).then(schooldata => {
                    fetch("https://classmate-iu0n.onrender.com/api/roles", {
                        credentials: "include"
                    }).then(res => res.json()).then(roledata => {
                        if (formData.role == "ucenik") {
                            fetch("https://classmate-iu0n.onrender.com/api/programmes", {
                                credentials: "include"
                            }).then(res => res.json()).then(programmedata => {
                                var role, programme, school;
                                for (var i = 0; i < schooldata.length; i++) {
                                    if (formData.school == schooldata[i].name)
                                        school = schooldata[i];
                                }
                                for (var i = 0; i < roledata.length; i++) {
                                    if (formData.role == roledata[i].roleName)
                                        role = roledata[i];
                                }
                                for (var i = 0; i < programmedata.length; i++) {
                                    if (formData.major == programmedata[i].programName)
                                        programme = programmedata[i];
                                }
                                var send_this = {
                                    created_at: new Date(),
                                    email: authdata.email,
                                    role: role,
                                    programme: programme,
                                    school: school
                                }
                                fetch("https://classmate-iu0n.onrender.com/api/users", {
                                    credentials: "include",
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "Application/json"
                                    },
                                    body: JSON.stringify(send_this)
                                }).then(() => {
                                    window.location.href = "https://pierogi-alpha.vercel.app/main";
                                })
                            })
                        } else if (formData.role = "nastavnik") {
                            fetch("https://classmate-iu0n.onrender.com/api/subjects", {
                                credentials: "include"
                            }).then(res => res.json()).then(subjectdata => {
                                var role, subject, school;
                                for (var i = 0; i < schooldata.length; i++) {
                                    if (formData.school == schooldata[i].name)
                                        school = schooldata[i];
                                }
                                for (var i = 0; i < roledata.length; i++) {
                                    if (formData.role == roledata[i].roleName)
                                        role = roledata[i];
                                }
                                for (var i = 0; i < subjectdata.length; i++) {
                                    if (formData.subject == subjectdata[i].subjectName)
                                        subject = subjectdata[i];
                                }
                                var send_this = {
                                    created_at: new Date(),
                                    email: authdata.email,
                                    role: role,
                                    subject: subject,
                                    school: school
                                }
                                fetch("https://classmate-iu0n.onrender.com/api/users", {
                                    credentials: "include",
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "Application/json"
                                    },
                                    body: JSON.stringify(send_this)
                                }).then(() => {
                                    window.location.href = "https://pierogi-alpha.vercel.app/main";
                                })

                            })
                        }
                    })
                })

            }
            )
        }
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

    // Funkcija koja ovisno o trenutnom koraku prikazuje odgovarajući dio forme, kasnije će se selektirane vrijednosti spremiti u bazu
    const renderFormContent = () => {
        const currentStepData = stepData[activeStep];

        if (activeStep === 2) {
            if (formData.role === "ucenik") {
                //console.log("tu sam");
                fetch("https://classmate-iu0n.onrender.com/api/programmes",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                ).then(res => res.json()).then(data => {
                    for (var i = 0; i < data.length; i++) {
                        //console.log(i + " " + data[i].school.name + " " + formData.school);
                        if (data[i].school.name == formData.school && !stepData[2].options.some(e => e.label == data[i].programName)) {
                            console.log(data[i]);
                            stepData[2].options.push(
                                {
                                    value: data[i].programName,
                                    label: data[i].programName
                                })
                        }
                    }
                    console.log(stepData[2].options);
                    //force reload
                    if (!programmes_updated) {
                        programmes_updated = true;
                        setValue((v) => v + 1);
                    }
                })

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
                fetch("https://classmate-iu0n.onrender.com/api/subjects",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                ).then(rez => rez.json()).then(subjects => {
                    for (var i = 0; i < subjects.length; i++) {
                        if (subjects[i].programme.school.name == formData.school && !stepData[3].options.some(e => e.label == subjects[i].subjectName)) {
                            console.log(subjects[i]);
                            stepData[3].options.push(
                                {
                                    value: subjects[i].subjectName,
                                    label: subjects[i].subjectName
                                }
                            )
                        }
                    }
                    //force reload
                    if (!subjects_updated) {
                        subjects_updated = true;
                        setValue((v) => v + 1);
                    }
                })
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
