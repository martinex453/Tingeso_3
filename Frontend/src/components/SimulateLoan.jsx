import { React, useState } from "react";
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import userService from "../services/loan.service";

const SimulateLoan = () => {
    const [capital, setCapital] = useState("");
    const [term, setTerm] = useState("");
    const [interest, setInterest] = useState("");
    const [result, setResult] = useState(null);
    const [loantype, setloantype] = useState("1");
    const [interestRange, setInterestRange] = useState("3.5 - 5");

    const updateInterestRange = (type) => {
        switch (type) {
            case "1":
                setInterestRange("3.5 - 5");
                break;
            case "2":
                setInterestRange("4 - 6");
                break;
            case "3":
                setInterestRange("5 - 7");
                break;
            case "4":
                setInterestRange("4.5 - 6");
                break;
            case "5":
                setInterestRange("6 - 8");
                break;
            default:
                setInterestRange("3.5 - 5");
        }
    };

    const formatNumberWithCommas = (number) => {
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const removeNumberFormat = (formattedNumber) =>
        formattedNumber.replace(/\D/g, ""); // Eliminar todo lo que no sea un dígito

    const handleSubmit = (e) => {
        e.preventDefault();

        const unformattedCapital = removeNumberFormat(capital);

        if (!unformattedCapital || !term || !interest || !loantype) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        // Validaciones de interés según el tipo de crédito
        switch (loantype) {
            case "1":
                if (interest < 3.5 || interest > 5) {
                    alert("El interés debe estar entre 3.5 y 5.");
                    return;
                }
                break;
            case "2":
                if (interest < 4 || interest > 6) {
                    alert("El interés debe estar entre 4 y 6.");
                    return;
                }
                break;
            case "3":
                if (interest < 5 || interest > 7) {
                    alert("El interés debe estar entre 5 y 7.");
                    return;
                }
                break;
            case "4":
                if (interest < 4.5 || interest > 6) {
                    alert("El interés debe estar entre 4.5 y 6.");
                    return;
                }
                break;
            case "5":
                if (interest < 6 || interest > 8) {
                    alert("El interés debe estar entre 6 y 8.");
                    return;
                }
                break;
            default:
                break;
        }

        const loanTypeNameMap = {
            "1": "Primera vivienda",
            "2": "Segunda vivienda",
            "3": "Propiedades comerciales",
            "4": "Remodelación",
        };

        const simulateMessage = `¿Está seguro de que desea simular el crédito con los siguientes datos?
        \n\nCapital: ${unformattedCapital}\nPlazo: ${term} años\nInterés: ${interest}%\nTipo de crédito: ${loanTypeNameMap[loantype]}`;

        if (window.confirm(simulateMessage)) {
            userService
                .simulate(unformattedCapital, term, interest)
                .then((response) => {
                    setResult(Math.round(response.data));
                    alert("Simulación realizada con éxito. Revisa el resultado en la parte inferior de la página.");
                })
                .catch((e) => {
                    alert("Error al simular el crédito", e);
                    console.log("Error al simular el crédito", e);
                });
        } else {
            console.log("Simulación cancelada");
        }
    };

    const handleCapitalChange = (e) => {
        let value = e.target.value.replace(/\./g, ""); // Remover el separador de miles
        if (/^\d+$/.test(value) || value === "") {
            setCapital(formatNumberWithCommas(value));
        }
    };

    const handleTermChange = (e) => {
        let value = e.target.value;

        if (/^\d+$/.test(value) || value === "") {
            setTerm(value);
        }
    };

    const handleInterestChange = (e) => {
        const value = e.target.value;

        if (/^(?!-)\d*\.?\d+$/.test(value) || value === "") {
            setInterest(value);
        }
    };

    const formatResultWithCommas = (number) => {
        return number.toLocaleString();
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            component="form"
            onSubmit={handleSubmit} // Aquí cambiamos a handleSubmit
        >
            <div style={{ backgroundColor: '#e3f2fd', width: '100%', borderRadius: '20px', marginBottom: '5vh', color: '#1a1a1a' }}><h1>Simulador de crédito</h1></div>
            <Box>
                <br />
                <FormControl fullWidth>
                    <TextField
                        id="capital"
                        label="Capital a solicitar"
                        value={capital} // Usamos tempCapital aquí
                        onChange={handleCapitalChange}
                        InputProps={{
                            inputMode: 'numeric',
                        }}
                    />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                    <TextField
                        id="term"
                        label="Plazo en años"
                        type="number"
                        value={term} // Usamos tempTerm aquí
                        onChange={handleTermChange}
                    />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                    <InputLabel id="loan-type-label">Tipo de crédito</InputLabel>
                    <Select
                        labelId="loan-type-label"
                        id="loan-type"
                        value={loantype}
                        onChange={(e) => {
                            setloantype(e.target.value);
                            updateInterestRange(e.target.value);
                        }}
                    >
                        <MenuItem value="1">Primera vivienda</MenuItem>
                        <MenuItem value="2">Segunda vivienda</MenuItem>
                        <MenuItem value="3">Propiedades comerciales</MenuItem>
                        <MenuItem value="4">Remodelación</MenuItem>
                    </Select>
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
                    <TextField
                        id="interest"
                        label="Interés en porcentaje"
                        type="number"
                        value={interest} // Usamos tempInterest aquí
                        onChange={handleInterestChange} // Usamos la nueva función de cambio
                        helperText={`Ejemplo: 3% - Rango: ${interestRange}`}
                    />
                </FormControl>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Simular Crédito
                </Button>
                {result && (
                    <Typography variant="h6" color="textSecondary" sx={{ mt: 2, backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '20px', color: '#1a1a1a', fontWeight: 'bold' }}>
                        {typeof result === 'string' ? result : `Su crédito de ${formatResultWithCommas(capital)} CLP, en un plazo de ${term} años, a un interés del ${interest}% es:\n${formatResultWithCommas(result)} CLP mensuales por ${term * 12} meses.`}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default SimulateLoan;
