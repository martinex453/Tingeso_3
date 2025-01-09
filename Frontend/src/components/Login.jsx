import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Box, FormControl } from '@mui/material';
import userService from "../services/user.service";

const Login = () => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const userLog = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Rellene todos los campos");
            return;
        }
        const user = {
            password,
            email,
        };

        await userService.login(user)
        .then(async response => {
            if(response.data != 0){
                console.log("User logged in successfully!");
                const userType = await userService.getId(response.data);
                localStorage.setItem("usertype", userType.data.usertype);
                localStorage.setItem("user", JSON.stringify(response.data));
                alert("Inicio de sesión exitoso");
                navigate("/home");
            }
            else{
                alert("Usuario o contraseña incorrectos");
            }
        })
        .catch(e => {
            console.log("There was an error logging in the user!",e);
        });
    };
    return (
        <Box 
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            component="form"
            style={{
                backgroundColor: '#e3f2fd',
                width: '30vw', 
                margin: 'auto', 
                padding: '20px', 
                borderRadius: '15px', 
                boxShadow: '0px 4px 10px 2px rgba(0, 0, 0, 0.1)',
            }}
        >
            <h1 style={{ color: '#1a1a1a' }}>Bienvenido a PrestaBanco</h1>
            <h4 style={{ color: '#1a1a1a' }}>Ingresa tus datos para iniciar sesión</h4>
            <hr/>
    
            <FormControl fullWidth>
                <TextField
                    id="email"
                    label="Correo"
                    type="email"
                    variant="standard"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputLabelProps={{ style: { color: '#1a1a1a' }}}
                />
            </FormControl>
            <br/>
            <FormControl fullWidth>
                <TextField
                    id="password"
                    label="Contraseña"
                    variant="standard"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputLabelProps={{ style: { color: '#1a1a1a' }}}
                />
            </FormControl>
            <br/>
            <Button
                variant="contained"
                color="primary"
                size="large"
                style={{
                    margin: 'auto', 
                    padding: '12px 40px', 
                    fontSize: '20px', 
                    backgroundColor: '#646cff',
                    color: '#fff',
                    borderRadius: '8px',
                }}
                onClick={(e) => userLog(e)}
            >
                Iniciar sesion
            </Button>
            <br/>
            <Link to="/" style={{ color: '#646cff' }}>Registrarse</Link>
        </Box>
    );
    
}

export default Login;