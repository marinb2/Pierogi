import logo from "../assets/logo.svg";
import '../styles/RegisterPage.css';
import React from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

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
            { value: '', label: 'Odaberite ulogu', disabled: true },
            { value: "učenik", label: 'Učenik' },
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

    const [activeStep, setActiveStep] = React.useState(0);
    const [formData, setFormData] = React.useState({
        role: '',
        school: '',
        major: '',
        subject: ''
    });

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
                                    sx={{ mr: 1, width: '150px', color: 'rgba(103, 58, 183, 1)', borderColor: 'rgba(103, 58, 183, 1)', marginLeft: '8px', border: '1px solid'}}
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
