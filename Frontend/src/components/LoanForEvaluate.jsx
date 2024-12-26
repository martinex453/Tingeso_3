import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import loanService from "../services/loan.service";
import userService from "../services/user.service";

const LoanForEvaluate = () => {
    const [loans, setLoans] = useState([]);
    const [users, setUsers] = useState({});
    const login = Number(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [userType, setUserType] = useState(localStorage.getItem("usertype"));
    if(userType != "2"){
        navigate("/home");
    }

    const getLoans = () => {
        loanService.getLoansForEvaluate()
            .then(response => {
                const filteredLoans = response.data.filter(loan => loan.userId !== login);
                setLoans(filteredLoans);
            })
            .catch((e) => {
                console.log("Error getting loans", e);
            });
    }

    const getUsers = () => {
        userService.getAll()
            .then(response => {
                const usersMap = {};
                response.data.forEach(user => {
                    usersMap[user.id] = user;
                });
                setUsers(usersMap);
            })
            .catch((e) => {
                console.log("Error getting users", e);
            });
    }

    useEffect(() => {
        getLoans();
        getUsers();
    }, []);

    const getStatusString = (status) => {
        if (status === 1) return "En revisión inicial";
        if (status === 3) return "En evaluación";
        if (status === 4) return "Pre-aprobado";
        if (status === 5) return "En aprobación final";
        if (status === 6) return "Aprobado";
        if (status === 9) return "En desembolso";
        return "Desconocido";
    }

    const getLoanTypeString = (loantype) => {
        if (loantype === 1) return "Primera Vivienda";
        if (loantype === 2) return "Segunda Vivienda";
        if (loantype === 3) return "Local comercial";
        if (loantype === 4) return "Remodelación";
        return "Tipo Desconocido";
    }

    const handleEvaluate = (loanId) => {
        localStorage.setItem("loanId", loanId);
        navigate("/creditEvaluation");
    }

    // Function to format numbers with thousands separator
    const formatNumber = (number) => {
        return new Intl.NumberFormat('es-ES').format(number);
    }

    return (
        <Box>
            <div style={{ backgroundColor: '#e3f2fd', width: '100%', borderRadius: '12px', color: '#1a1a1a'}}><h2>Creditos por evaluar</h2></div>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>Rut</TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>Capital</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>Tipo de Crédito</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>Plazo en años</TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>Estado</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loans.map((loan) => (
                        <TableRow key={loan.id}>
                            <TableCell align="left">{users[loan.userId] ? users[loan.userId].rut : "Cargando..."}</TableCell>
                            <TableCell align="left">{users[loan.userId] ? users[loan.userId].name : "Cargando..."}</TableCell>
                            <TableCell align="right">{formatNumber(loan.capital)}</TableCell>
                            <TableCell align="right">{getLoanTypeString(loan.loantype)}</TableCell>
                            <TableCell align="right">{loan.term}</TableCell>
                            <TableCell align="left">{getStatusString(loan.status)}</TableCell>
                            <TableCell align="center">
                                <Button variant="contained" onClick={() => handleEvaluate(loan.id)}>
                                    Evaluar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Box>
    );
}

export default LoanForEvaluate;
