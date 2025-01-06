import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import loanService from "../services/loan.service";
import userService from "../services/user.service";


const CreditEvaluation = () => {
    const [income, setIncome] = useState("");
    const [creditHistory, setCreditHistory] = useState("");
    const [workEstability, setWorkEstability] = useState("");
    const [userId, setUserId] = useState(() => Number(localStorage.getItem("user")));
    const [balance, setBalance] = useState("");
    const [loanId, setLoanId] = useState(() => Number(localStorage.getItem("loanId")));
    const [documents, setDocuments] = useState("");
    const [consistentSaving, setConsistentSaving] = useState("");
    const [periodicSaving, setPeriodicSaving] = useState("");
    const [recentRetirement, setRecentRetirement] = useState("");
    const [savingYears, setSavingYears] = useState("");
    const [loanAmount, setLoanAmount] = useState("");
    const [state, setState] = useState("");
    const navigate = useNavigate();
    const [userType, setUserType] = useState(localStorage.getItem("usertype"));

    useEffect(() => {
        if (userType !== "2") {
            navigate("/home");
        } else {
            const fetchLoanStatus = async () => {
                try {
                    const loanStatus = await loanService.statusInt(loanId);
                    setState(loanStatus.data);
                } catch (error) {
                    console.error("Error fetching loan status:", error);
                }
            };
            fetchLoanStatus();
        }
    }, [loanId, userType, navigate]);

    const upLoan = async (loanId) => {
        try {
            const loan = await loanService.getId(loanId);
            setLoanAmount(loan.data.capital);
            return loan.data;
        } catch (error) {
            console.error("Error fetching loan:", error);
            return null;
        }
    };

    const formatNumber = (value) => {
        if (!value) return "";
        const number = Number(value.replace(/\D/g, "")); // Elimina caracteres no numéricos
        return number.toLocaleString("es-CL"); // Formato chileno, ajustable según el país
    };
    
    const handleIncomeChange = (e) => {
        const rawValue = e.target.value;
        const formattedValue = formatNumber(rawValue);
        setIncome(formattedValue); // Actualizamos el estado con el valor formateado
    };
    
    const handleBalanceChange = (e) => {
        const rawValue = e.target.value;
        const formattedValue = formatNumber(rawValue);
        setBalance(formattedValue); // Actualizamos el estado con el valor formateado
    };

    const handleDocumentSubmit = async (value) => {
        setDocuments(value);
        const loan = await upLoan(loanId);
        if (loan) {
            let newState = state;
            newState = value === "2" ? 3 : 2;
            setState(newState);
            await loanService.updateState(loan, newState);
        }
    };

    const handleEvaluationSubmit = async (event) => {
        event.preventDefault();
        console.log("Entrando a handleEvaluationSubmit");
    
        // Verificar que todos los campos estén completos
        if (!income || !creditHistory || !workEstability || !balance || !consistentSaving || !periodicSaving || !savingYears || !recentRetirement) {
            alert("Rellene todos los campos");
            return;
        }
    
        // Eliminar comas y puntos como separadores de miles, luego convertir a números flotantes
        const income_aux = income ? parseFloat(income.replace(/[.,]/g, '')) : 0;
        const balance_aux = balance ? parseFloat(balance.replace(/[.,]/g, '')) : 0;
    
        // Verificar que el parseo haya sido exitoso
        console.log("Luego de los parseFloat");
        console.log(income_aux);  // Esto debe mostrar el valor numérico
        console.log(balance_aux);  // Esto debe mostrar el valor numérico
    
        // Proceder con el cálculo y la lógica
        const loan = await upLoan(loanId);
        const maxCapital = await loanService.maxCapital(loanId);
        const incomeQuota = await loanService.incomeQuota(income_aux, loanId);
        const debtBalance = await loanService.debtIncome(loan.userId, income_aux);
    
        const ageLimit = await userService.ageLimit(loan.userId);
        const isConsistentSaving = consistentSaving === "true";
        const isPeriodicSaving = periodicSaving === "true";
        const isRecentRetirement = recentRetirement === "true";
        
        const balance_aux2 = Number(balance_aux);
        const savingYears_aux = Number(savingYears);
        const loanAmount_aux = Number(loanAmount);

        console.log(typeof balance_aux2);
        console.log(typeof savingYears_aux);
        console.log(typeof loanAmount_aux);
        console.log(typeof isConsistentSaving);
        console.log(typeof isPeriodicSaving);
        console.log(typeof isRecentRetirement);
        console.log(typeof loan.id);

        const savingCapacity = await loanService.savingCapacity(balance_aux2, loan.id, isConsistentSaving, isPeriodicSaving, isRecentRetirement, savingYears_aux, loanAmount_aux);
        
        console.log("Cargo todo");
    
        // Condicionales basadas en los resultados
        if (
            incomeQuota.data &&
            debtBalance.data &&
            maxCapital.data &&
            savingCapacity.data == 1 &&
            ageLimit &&
            creditHistory == 1 &&
            workEstability == 1
        ) {
            console.log("Se cumplen las condiciones");
            let newState = 4;
            setState(newState);
            await loanService.updateState(loan, newState);
        } else if (
            incomeQuota.data &&
            debtBalance.data &&
            maxCapital.data &&
            savingCapacity.data == 2 &&
            ageLimit &&
            creditHistory == 1 &&
            workEstability == 1
        ) {
            console.log("Se cumplen parcialmente las condiciones");
            let newState = 2;
            setState(newState);
            await loanService.updateState(loan, newState);
        } else {
            console.log("No se cumplen las condiciones");
            let newState = 7;
            setState(newState);
            await loanService.updateState(loan, newState);
        }
    };
    

    const handleDowloadDocuments = async (event) => {
        event.preventDefault();
        try {
            const response = await loanService.downloadDocuments(loanId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `documents_${loanId}.zip`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the ZIP file:', error);
        }
    };

    const handleSign = async (event) => {
        event.preventDefault();
        console.log("Entrando a handleSign");
        const loan = await upLoan(loanId);
        console.log("luego del up");
        const newState = 6;
        setState(newState);
        console.log("luego del set");
        await loanService.updateState(loan, newState);
        console.log("luego del update");
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" component="form">
            <div style={{ backgroundColor: '#e3f2fd', width: '100%', borderRadius: '20px', marginBottom: '5vh', color: '#1a1a1a'}}>
                <h1>Credit Evaluation</h1>
            </div>
            <Box>
                <Box style={{ display: state === 1 ? 'block' : 'none' }}>
                    <Button onClick={handleDowloadDocuments} variant="contained" color="primary" fullWidth>
                        Descargar Documentos
                    </Button>
                    <br />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="documents">Documentos faltantes</InputLabel>
                        <Select
                            labelId="documents"
                            id="documents_id"
                            value={documents}
                            onChange={(e) => setDocuments(e.target.value)}
                            label="Documentos faltantes"
                        >
                            <MenuItem value="1">Si</MenuItem>
                            <MenuItem value="2">No</MenuItem>
                        </Select>
                        <br />
                        <Button onClick={() => handleDocumentSubmit(documents)} variant="contained" color="primary" sx={{ mt: 2 }}>
                            Confirmar
                        </Button>
                    </FormControl>
                </Box>

                <Box style={{ display: state === 2 ? 'block' : 'none' }}>
                    <div style={{ color: "#000000" }}>
                        El cliente no ha subido toda la documentación aún o se requiere una revision adicional.
                    </div>
                    <div style={{ color: "#000000" }}>
                        Se podrá continuar con la revisión cuando se hayan manejado estas condiciones.
                    </div>
                    
                </Box>

                <Box style={{ display: state === 3 ? 'block' : 'none' }}>
                    <FormControl fullWidth sx={{width: '70vw'}}>
                            <TextField
                                id="income"
                                label="Ingreso Cliente"
                                value={income}
                                onChange={handleIncomeChange}
                                fullWidth
                            />
                        </FormControl>
                        <br/>
                        <FormControl fullWidth sx={{width: '70vw'}}>
                            <InputLabel id="creditHistory">Historial Crediticio</InputLabel>
                            <Select
                                labelId="creditHistory"
                                id="creditHistory"
                                value={creditHistory}
                                onChange={(e) => setCreditHistory(e.target.value)}
                            >
                                <MenuItem value="1">Normal</MenuItem>
                                <MenuItem value="2">Existe Morosidad</MenuItem>
                            </Select>
                        </FormControl>
                        <br/>
                        <FormControl fullWidth sx={{width: '70vw'}}>
                            <InputLabel id="workEstability">Estabilidad Laboral</InputLabel>
                            <Select
                                labelId="workEstability"
                                id="workEstability"
                                value={workEstability}
                                onChange={(e) => setWorkEstability(e.target.value)}
                            >
                                <MenuItem value="1">Estable</MenuItem>
                                <MenuItem value="2">Inestable</MenuItem>
                            </Select>
                        </FormControl>
                        <br/>
                        <FormControl fullWidth sx={{width: '70vw'}}>
                            <TextField
                                id="balance"
                                label="Saldo Cliente"
                                value={balance}
                                onChange={handleBalanceChange}
                                fullWidth
                            />
                        </FormControl>
                        <br/>
                        <FormControl fullWidth sx={{width: '70vw'}}>
                            <InputLabel id="consistentSaving">Ahorro consistente</InputLabel>
                            <Select
                                labelId="consistentSaving"
                                id="consistentSaving"
                                value={consistentSaving}
                                onChange={(e) => setConsistentSaving(e.target.value)}
                            >
                                <MenuItem value="true">Consistente</MenuItem>
                                <MenuItem value="false">Inconsistente</MenuItem>
                            </Select>
                        </FormControl>
                        <br/>
                        <FormControl fullWidth sx={{width: '70vw'}}>
                            <InputLabel id="periodicSaving">Depositos periodicos</InputLabel>
                            <Select
                                labelId="periodicSaving"
                                id="periodicSaving"
                                value={periodicSaving}
                                onChange={(e) => setPeriodicSaving(e.target.value)}
                            >
                                <MenuItem value="true">Regular</MenuItem>
                                <MenuItem value="false">Irregular</MenuItem>
                            </Select>
                        </FormControl>
                        <br/>
                        <FormControl fullWidth sx={{width: '70vw'}}>
                        <TextField
                                id="savingYears"
                                label="Años de ahorro"
                                type="number"
                                value={savingYears}
                                onChange={(e) => {
                                    const rawValue = e.target.value;
                                    const validValue = rawValue.match(/^\d+$/) ? rawValue : rawValue.replace(/\D/g, '');
                                    setSavingYears(validValue);
                                }}
                            />
                        </FormControl>
                        <br/>
                        <FormControl fullWidth sx={{width: '70vw'}}>
                            <InputLabel id="recentRetirement">Retiros importantes recientes</InputLabel>
                            <Select
                                labelId="recentRetirement"
                                id="recentRetirement"
                                value={recentRetirement}
                                onChange={(e) => setRecentRetirement(e.target.value)}
                            >
                                <MenuItem value="true">Si</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                            </Select>
                        </FormControl>
                        <br />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={handleEvaluationSubmit}
                            sx={{ mt: 2 }}
                        >
                            Evaluar
                        </Button>
                </Box>

                <Box style={{ display: state === 4 ? 'block' : 'none' }}>
                    <div style={{color: "#000000"}}>La solicitud de credito ha sido pre-aprobada, se podra continuar con el proceso una vez el cliente acepte los terminos.</div>
                </Box>

                <Box style={{ display: state === 5 ? 'block' : 'none' }}>
                    <Box>
                        <div style={{color: "#000000"}}>El cliente ha aceptado las condiciones del credito, se podra continuar una vez firmado el contrato.</div>
                        <br />
                        <Button type="submit"
                                variant="contained"
                                color="primary"
                                onClick={handleSign}
                                sx={{ mt: 2 }}>
                            Contrato Firmado
                        </Button>
                    </Box>
                </Box>

                <Box style={{ display: state === 6 ? 'block' : 'none' }}>
                    <div style={{color: "#000000"}}>El credito ha sido aprobado, se realizara el desembolso al cliente cuando este lo solicite.</div>
                </Box>

                <Box style={{ display: state === 7 ? 'block' : 'none' }}>
                    <div style={{color: "#000000"}}>El credito ha sido rechazado.</div>
                </Box>

                <Box style={{ display: state === 8 ? 'block' : 'none' }}>
                    <div style={{color: "#000000"}}>La solicitud de credito ha sido rechazada por el cliente.</div>
                </Box>
                
                <Box style={{ display: state === 9 ? 'block' : 'none' }}>
                    <div style={{color: "#000000"}}>Se esta realizando el desembolso del credito al cliente.</div>
                </Box>
                
            </Box>
        </Box>
    );
};

export default CreditEvaluation;

