import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import calculadora from './images/calculadora.png';
import solicitud from './images/solicitud.png';

const Home = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            component="form"
        >
            <Box
                color={'#000000'}
            >
            <h1>Bienvenido a PrestaBanco:</h1>
            <h2>Puedes simular o solicitar un credito directamente desde estos botones</h2>
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" gap={2}>
            <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" gap={2}>
                <Link to="/simulate" style={{ textDecoration: 'none' }}>
                    <div style={{ backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>
                        <img src={calculadora} alt="Calculadora" style={{ width: '100px', height: 'auto' }} />
                        <br />
                        <span style={{ marginLeft: '5px', color: '#1a1a1a' }}>Simular crédito</span>
                    </div>
                </Link>
                
                <Link to="/applyForLoan" style={{ textDecoration: 'none' }}>
                    <div style={{ backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>
                        <img src={solicitud} alt="Solicitud" style={{ width: '100px', height: 'auto' }} />
                        <br />
                        <span style={{ marginLeft: '5px', color: '#1a1a1a' }}>Solicitar crédito</span>
                    </div>
                </Link>
            </Box>
            </Box>
        </Box>
    );
}

export default Home;
