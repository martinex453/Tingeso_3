import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from "react-router-dom";
import loanService from '../services/loan.service';
import documentService from '../services/document.service';
import userService from '../services/user.service';

const ApplyForLoan = () => {
    const [userId, setUserid] = useState(() => Number(localStorage.getItem("user")));
    const [capital, setCapital] = useState("");
    const [term, setTerm] = useState("");
    const [loantype, setloantype] = useState("");
    const [interest, setInterest] = useState("");
    const [monthfee, setMonthFee] = useState("");
    const [status, setStatus] = useState(1);
    const [docIngresos, setDocIngresos] = useState("");
    const [docAvaluo, setDocAvaluo] = useState("");
    const [docHistorialCrediticio, setDocHistorialCrediticio] = useState("");
    const [docEscrituraPrimeraVivienda, setDocEscrituraPrimeraVivienda] = useState("");
    const [docEstadoFinanciero, setDocEstadoFinanciero] = useState("");
    const [docPlanNegocios, setDocPlanNegocios] = useState("");
    const [docPresupuestoRemodelacion, setDocPresupuestoRemodelacion] = useState("");
    const [rut, setRut] = useState("");
    const [propCost, setPropCost] = useState("");
    const [interestRange, setInterestRange] = useState("3.5 - 5");
    const navigate = useNavigate();

    const formatRut = (rut) => {
        let value = rut.replace(/\D/g, "");
    
        if (value.length <= 2) return value;
        if (value.length <= 5) return `${value.slice(0, 2)}.${value.slice(2)}`;
        if (value.length <= 8) return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
        return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}-${value.slice(8, 9)}`;
      };
    
    const handleRutChange = (e) => {
        let value = e.target.value;
    
        // Eliminar los puntos y el guion si se vuelve a escribir
        value = value.replace(/\./g, "").replace("-", "");
    
        // Solo permitir números y el carácter "K" o "k"
        if (/^\d+$/.test(value) || /^[0-9Kk]*$/.test(value)) {
            // Formatear el RUT con el guion al final
            setRut(formatRut(value));
        }
    };

    const formatNumberWithCommas = (number) => {
        number = number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return number;
    };

    const handleCapitalChange = (e) => {
        let value = e.target.value.replace(/\./g, '');
        if (/^\d+$/.test(value) || value === "") {
            setCapital(formatNumberWithCommas(value));
        }
    };

    const handlePropCostChange = (e) => {
        let value = e.target.value.replace(/\./g, '');
        if (/^\d+$/.test(value) || value === "") {
            setPropCost(formatNumberWithCommas(value));
        }
    };

    const handleTermChange = (e) => {
        const value = e.target.value;
        if (/^\d+$/.test(value)) {
            setTerm(value);
        }
    };

    const handleLoanTypeChange = (e) => {
        const value = e.target.value;
        setloantype(value);
        updateInterestRange(value); // Actualiza el rango de interés basado en el tipo de préstamo
    };

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

    const applyLoan = async (e) => {
        e.preventDefault();
        
        // Desformateo los números antes de enviarlos
        const unformattedCapital = capital.replace(/\./g, '');
        const unformattedPropCost = propCost.replace(/\./g, '');
        
        const unformattedRut = rut.replace(/\./g, '').replace(/[^0-9Kk-]/g, "");
        console.log(unformattedRut);
        if (!unformattedCapital || !term || !loantype || !interest || !unformattedPropCost || !unformattedRut) {
            alert("Rellene todos los campos");
            return;
        }

        switch (loantype) {
            case "1":
                if(docIngresos === "" || docAvaluo === "" || docHistorialCrediticio === "" || docEscrituraPrimeraVivienda === ""){
                    alert("Debe adjuntar todos los documentos requeridos, de lo contrario, la solicitud podria ser rechazada");
                    return;
                }
                break;
            case "2":
                if(docIngresos === "" || docAvaluo === "" || docHistorialCrediticio === "" || docEscrituraPrimeraVivienda === "" || docEstadoFinanciero === "" || docPlanNegocios === ""){
                    alert("Debe adjuntar todos los documentos requeridos, de lo contrario, la solicitud podria ser rechazada");
                    return;
                }
                break;
            case "3":
                if(docIngresos === "" || docAvaluo === "" || docHistorialCrediticio === "" || docEstadoFinanciero === "" || docPlanNegocios === ""){
                    alert("Debe adjuntar todos los documentos requeridos, de lo contrario, la solicitud podria ser rechazada");
                    return;
                }
                break;
            case "4":
                if(docIngresos === "" || docAvaluo === "" || docHistorialCrediticio === "" || docEstadoFinanciero === "" || docPlanNegocios === "" || docPresupuestoRemodelacion === ""){
                    alert("Debe adjuntar todos los documentos requeridos, de lo contrario, la solicitud podria ser rechazada");
                    return;
                }
                break;
        }   

        
        let loanTypeName = "";
        console.log(loantype);
        switch (loantype) {
            case "1":
                loanTypeName = "Primera vivienda"; 
                break; // Se agregó el break aquí
            case "2":   
                loanTypeName = "Segunda vivienda";
                break; // Se agregó el break aquí
            case "3":
                loanTypeName = "Propiedades comerciales";
                break; // Se agregó el break aquí
            case "4":
                loanTypeName = "Remodelación";
                break; // Se agregó el break aquí
        }

        const applyloanMessage = `¿Está seguro de que desea solicitar el siguiente crédito? 
        \n\nRut: ${rut}\nCosto de Propiedad: ${propCost}\nCapital: ${unformattedCapital}\nPlazo: ${term} años\nInterés: ${interest}%\nTipo de crédito: ${loanTypeName}`;

        if(window.confirm(applyloanMessage)){
            const user = await userService.getId(userId);
            if(user.data.rut !== unformattedRut){
                alert("El rut ingresado no coincide con el rut del usuario");
                return;
            }
        
            switch (loantype) {
                case "1":
                    if (interest > 5 || interest < 3.5) {
                        alert("El interes debe estar entre 3.5 y 5");
                    }
                    break;
                case "2":
                    if (interest > 6 || interest < 4) {
                        alert("El interés debe estar entre 4 y 6");
                    }
                    break;
                case "3":
                    if (interest > 7 || interest < 5) {
                        alert("El interés debe estar entre 5 y 7");
                    }
                    break;
                case "4":
                    if (interest > 6 || interest < 4.5) {
                        alert("El interés debe estar entre 4.5 y 6");
                    }
                    break;
            }
        
            const loan = {
                capital: unformattedCapital,
                term,
                loantype,
                interest,
                status,
                monthfee,
                propCost: unformattedPropCost,
                userId,
            };
        
            try {
                const documents = [
                    { file: docIngresos, name: "Comprobante de ingresos" },
                    { file: docAvaluo, name: "Certificado de avalúo" },
                    { file: docHistorialCrediticio, name: "Historial crediticio" },
                    { file: docEscrituraPrimeraVivienda, name: "Escritura Primera Vivienda" },
                    { file: docEstadoFinanciero, name: "Estado Financiero" },
                    { file: docPlanNegocios, name: "Plan de Negocios" },
                    { file: docPresupuestoRemodelacion, name: "Presupuesto de Remodelación" },
                ];
        
                const loanResponse = await loanService.create(loan);
                console.log("Loan applied successfully!", loanResponse.data);
        
                for (const doc of documents) {
                    if (doc.file) {
                        const formData = {
                            loanId: loanResponse.data.id,
                            file: doc.file,
                            name: doc.name,
                        };
                        console.log("Uploading document:", doc.name);
                        await documentService.uploadDocument(formData, userId);
                    }
                }
        
                alert("Tu solicitud ha sido enviada exitosamente.");
                navigate("/home");
            } catch (e) {
                console.log("There was an error applying for the loan or uploading documents!", e);
            }
        }
    };
    
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            component="form"
            onSubmit={applyLoan}
        >
            <div style={{ backgroundColor: '#e3f2fd', width: '100%', borderRadius: '20px', color: '#1a1a1a'}}><h1>Solicitud de credito</h1></div>
            <br/>
            <FormControl fullWidth sx={{ width: '70vw' }}>
                <TextField
                    id="rut"
                    label="Rut"
                    type="text"
                    value={rut}
                    onChange={handleRutChange} // Modificado para utilizar la función handleRutChange
                    helperText="Ejemplo: 12345678-9"
                />
            </FormControl>
            <br />
            <FormControl fullWidth sx={{ width: '70vw' }}>
                <TextField
                    id="propCost"
                    label="Costo de la propiedad"
                    type="text"
                    value={propCost}
                    onChange={handlePropCostChange} // Modificado para utilizar la función handleCapitalChange
                    inputProps={{ min: 0 }}
                />
            </FormControl>
            <br />
            <FormControl fullWidth sx={{ width: '70vw' }}>
                <TextField
                    id="capital"
                    label="Capital a solicitar"
                    type="text"
                    value={capital}
                    onChange={handleCapitalChange} // Modificado para utilizar la función handleCapitalChange
                    inputProps={{ min: 0 }}
                />
            </FormControl>
            <br />
            <FormControl fullWidth sx={{ width: '70vw' }}>
                <TextField
                    id="term"
                    label="Plazo en años"
                    type="number"
                    value={term}
                    onChange={handleTermChange} // Modificado para utilizar la función handleTermChange
                    inputProps={{ min: 0, step: 1 }}
                />
            </FormControl>
            <br />
            <FormControl fullWidth sx={{ width: '70vw' }}>
                <InputLabel id="loan-type-label">Tipo de crédito</InputLabel>
                <Select
                    labelId="loan-type-label"
                    id="loan-type"
                    value={loantype}
                    onChange={handleLoanTypeChange}
                >
                    <MenuItem value="1">Primera vivienda</MenuItem>
                    <MenuItem value="2">Segunda Vivienda</MenuItem>
                    <MenuItem value="3">Propiedades Comerciales</MenuItem>
                    <MenuItem value="4">Remodelación</MenuItem>
                </Select>
            </FormControl>
            <br />
            <FormControl fullWidth>
                <TextField
                    id="interest"
                    label="Interés en porcentaje"
                    type="number"
                    value={interest}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || (Number(value) >= 0)) {
                            setInterest(value);
                        }
                    }}
                    helperText={`Ejemplo: 3% - Rango: ${interestRange}`}
                />
            </FormControl>
            <br />
            {loantype && (
                <Box 
                    mt={2} 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center" 
                    sx={{ gap: 2 }}
                >
                    <FormControl fullWidth style={{ color: '#000000', fontSize: '25px' }}>
                        <label htmlFor="ingresos">Comprobante de ingresos</label>
                        <input
                            accept="application/pdf"
                            id="ingresos"
                            type="file"
                            onChange={(e) => setDocIngresos(e.target.files[0])}
                        />
                    </FormControl>
                    <br />
                    <FormControl fullWidth style={{ color: '#000000', fontSize: '25px' }}>
                        <label htmlFor="avaluo">Certificado de avalúo</label>
                        <input
                            accept="application/pdf"
                            id="avaluo"
                            type="file"
                            onChange={(e) => setDocAvaluo(e.target.files[0])}
                        />
                    </FormControl>
                    <br />
                    {(loantype === "1" || loantype === "2") && (
                        <FormControl fullWidth style={{ color: '#000000', fontSize: '25px' }}>
                            <label htmlFor="historialCrediticio">Historial crediticio</label>
                            <input
                                accept="application/pdf"
                                id="historialCrediticio"
                                type="file"
                                onChange={(e) => setDocHistorialCrediticio(e.target.files[0])}
                            />
                        </FormControl>
                    )}
                    <br />
                    {loantype === "1" && (
                        <FormControl fullWidth style={{ color: '#000000', fontSize: '25px' }}>
                            <label htmlFor="escrituraPrimeraVivienda">Escritura de primera vivienda</label>
                            <input
                                accept="application/pdf"
                                id="escrituraPrimeraVivienda"
                                type="file"
                                onChange={(e) => setDocEscrituraPrimeraVivienda(e.target.files[0])}
                            />
                        </FormControl>
                    )}
                    <br />
                    {(loantype === "3" || loantype === "4") && (
                        <>
                            <FormControl fullWidth style={{ color: '#000000', fontSize: '25px' }}>
                                <label htmlFor="estadoFinanciero">Estado Financiero</label>
                                <input
                                    accept="application/pdf"
                                    id="estadoFinanciero"
                                    type="file"
                                    onChange={(e) => setDocEstadoFinanciero(e.target.files[0])}
                                />
                            </FormControl>
                            <br />
                            <FormControl fullWidth style={{ color: '#000000', fontSize: '25px' }}>
                                <label htmlFor="planNegocios">Plan de Negocios</label>
                                <input
                                    accept="application/pdf"
                                    id="planNegocios"
                                    type="file"
                                    onChange={(e) => setDocPlanNegocios(e.target.files[0])}
                                />
                            </FormControl>
                            <br />
                        </>
                    )}
                    {loantype === "4" && (
                        <FormControl fullWidth style={{ color: '#000000', fontSize: '25px' }}>
                            <label htmlFor="presupuestoRemodelacion">Presupuesto Remodelación</label>
                            <input
                                accept="application/pdf"
                                id="presupuestoRemodelacion"
                                type="file"
                                onChange={(e) => setDocPresupuestoRemodelacion(e.target.files[0])}
                            />
                        </FormControl>
                    )}
                    <br />
                </Box>
            )}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ backgroundColor: '#1E88E5' }}
            >
                Solicitar Crédito
            </Button>

        </Box>
    );
};

export default ApplyForLoan;
