import { React, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Box, FormControl } from '@mui/material';
import userService from "../services/user.service";

const Register = () => {
    const [name, setName] = useState("");
    const { id } = useParams();
    const [password, setPassword] = useState("");
    const [birthdate, setbirthDate] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [usertype, setUserType] = useState(1);
    const [rut, setRut] = useState("");
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

        value = value.replace(/\./g, "").replace("-", "");

        if (/^\d+$/.test(value) || /^[0-9Kk]*$/.test(value)) {
          setRut(formatRut(value));
        }
      };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        if (value.length <= 9) {
            setPhone(value);
        }
    };

    const userReg = (e) => {
        e.preventDefault();
        if (!name || !password || !birthdate || !email || !phone || !address) {
            alert("Rellene todos los campos");
            return;
        }

        const user = {
            name,
            password,
            birthdate,
            email,
            phone,
            address,
            usertype,
            id,
            rut
        };

        const confirmationMessage = `
            ¿Está seguro de que desea registrar los siguientes datos?
            
            Nombre: ${name}
            RUT: ${rut}
            Correo: ${email}
            Teléfono: ${phone}
            Dirección: ${address}
        `;
        
        // Mostrar el cuadro de confirmación
        if (window.confirm(confirmationMessage)) {
            // Si el usuario acepta, enviar los datos al backend
            userService.create(user)
                .then((response) => {
                    console.log("Usuario creado exitosamente!", response.data);
                    alert("Usuario registrado exitosamente");
                    navigate("/login");
                })
                .catch((e) => {
                    alert("Error al registrar el usuario", e);
                    console.log("Hubo un error al registrar el usuario", e);
                });
        } else {
            // Si el usuario cancela, no hacer nada
            console.log("Registro cancelado");
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            component="form"
            onSubmit={userReg}
            style={{
                backgroundColor: '#e3f2fd',
                width: '40vw',
                margin: 'auto',
                padding: '30px',
                borderRadius: '15px',
                boxShadow: '0px 4px 10px 2px rgba(0, 0, 0, 0.1)',
            }}
        >
            <h1 style={{ color: '#1a1a1a' }}>Bienvenido a PrestaBanco</h1>
            <h4 style={{ color: '#1a1a1a', textAlign: 'center' }} >
                Por favor, complete los siguientes campos para registrarse
            </h4>
            <FormControl fullWidth>
                <TextField
                    id="rut"
                    label="Rut"
                    variant="standard"
                    value={rut}
                    onChange={handleRutChange}
                    helperText="Ej. 12.587.698-8"
                    inputProps={{
                        maxLength: 12
                    }}
                />
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    id="name"
                    label="Nombre"
                    type="text"
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    id="email"
                    label="Correo"
                    variant="standard"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    id="password"
                    label="Contraseña"
                    type="password"
                    variant="standard"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FormControl>
            <br />
            <FormControl fullWidth>
                <TextField
                    id="date"
                    variant="standard"
                    type="date"
                    value={birthdate}
                    onChange={(e) => setbirthDate(e.target.value)}
                    helperText="Fecha de nacimiento"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    id="phone"
                    label="Telefono"
                    type="tel"
                    variant="standard"
                    value={phone}
                    onChange={handlePhoneChange}
                    helperText="Ejemplo: 123456789"
                />
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    id="address"
                    label="Direccion"
                    variant="standard"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    helperText="Calle 123, Ciudad 1"
                />
            </FormControl>
            <FormControl>
                <br />
                <Button
                    variant="contained"
                    style={{
                        backgroundColor: '#0d47a1',
                        color: '#ffffff',
                        margin: 'auto',
                        padding: '12px 20px',
                        fontSize: '18px',
                        borderRadius: '8px',
                    }}
                    onClick={(e) => userReg(e)}
                >
                    Registrar
                </Button>
            </FormControl>
            <hr style={{ width: '100%', border: '1px solid #bbdefb' }} />
            <Link to="/login" style={{ color: '#0d47a1', textDecoration: 'none' }}>
                Iniciar sesión
            </Link>
        </Box>
    );
};

export default Register;
