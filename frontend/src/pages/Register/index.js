import React, { createRef, useState } from 'react';
import { useAuth } from '../../hooks/Authentication'

import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify'

import fogueteImg from '../../assets/img/foguete.png';
import tituloImg from '../../assets/img/titulo.svg';

import { Container } from './styles';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { SubmitButton } from '../../components/SubmitButton';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  const { Registro } = useAuth()

  const inputEmail = createRef()
  const inputName = createRef()
  const inputPassword = createRef()
  const inputPassword2 = createRef()

  async function validarDados() {
    // Validando email
    try {
      await yup
        .string()
        .required(() => {
          inputEmail.current.focusOnError();
          toast.error('Este campo é obrigatório');
        })
        .email(() => {
          inputEmail.current.focusOnError();
          toast.error('Formato de email inválido');
        })
        .validate(email);
    } catch {
      return false;
    }

    // Validando Nome
    try {
      await yup
        .string()
        .required(() => {
          inputName.current.focusOnError();
          toast.error('Este campo é obrigatório');
        })
        .validate(name);
    } catch {
      return false;
    }

    // Validando Senha
    try {
      await yup
        .string()
        .required(() => {
          inputPassword.current.focusOnError();
          toast.error('Este campo é obrigatório');
        })
        .validate(password);
      if (confirmpassword !== password) {
        inputPassword2.current.focusOnError();
        toast.error('As senhas não coincidem');
        return false;
      }
    } catch {
      return false;
    }

    return true;
  }

  async function handleRegister(e) {
    e.preventDefault();
    const data = {
      email,
      name,
      password,
      confirmpassword,
    };

    const validated = await validarDados();

    if (validated) {
      const promise = Registro(email, password, name).then(() => {
        return new Promise((resolve) => { resolve("Usuário cadastrado com sucesso!") })
      }, (response) => {
          inputEmail.current.focusOnError()
          return new Promise((resolve, reject) => { reject(response) })
      })

      toast.promise(
        promise,
        {
          pending: 'Por favor, aguarde um momento...',
          success: {
            render({data}){
              return data
            },
          },
          error: {
            render({data}){
              return data
            }
          }
        }
      )
    }
  }

  return (
    <Container>
      <ToastContainer position='top-right' theme='colored' style={{ fontSize: '18px' }} />

      <img src={tituloImg} alt="titulo" className="titulo" />

      <Card altura="490px">
        <h2 className="titulo">Crie sua conta</h2>

        <form onSubmit={handleRegister}>
          <Input
            ref={inputEmail}
            placeholder="Seu e-mail"
            name="mail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              inputEmail.current.resetError()
            }}
            onBlur={() => {
              inputEmail.current.handleBlur()
              if (email !== '') inputEmail.current.fielled()
              else inputEmail.current.unfielled()
            }}
          />

          <Input
            ref={inputName}
            placeholder="Seu nome"
            name="user"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              inputName.current.resetError()
            }}
            onBlur={() => {
              inputName.current.handleBlur()
              if (name !== '') inputName.current.fielled()
              else inputName.current.unfielled()
            }}
          />

          <Input
            ref={inputPassword}
            placeholder="Sua senha"
            name="pass"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              inputPassword.current.resetError()
            }}
            onBlur={() => {
              inputPassword.current.handleBlur()
              if (password !== '') inputPassword.current.fielled()
              else inputPassword.current.unfielled()
            }}
            security="on"
          />

          <Input
            ref={inputPassword2}
            placeholder="Sua senha"
            name="pass"
            value={confirmpassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              inputPassword2.current.resetError()
            }}
            onBlur={() => {
              inputPassword2.current.handleBlur()
              if (confirmpassword !== '') inputPassword2.current.fielled()
              else inputPassword2.current.unfielled()
            }}
            security="on"
          />

          <SubmitButton>CADASTRAR</SubmitButton>
        </form>
      </Card>


      <div className="back">
        <FiArrowLeft size={24} color="#8257E5" />
        <div>
          <Link to="/">Voltar para login</Link>
        </div>

      </div>
      <img src={fogueteImg} alt="foguete" className="register-foguete" />

    </Container>
  );
}
