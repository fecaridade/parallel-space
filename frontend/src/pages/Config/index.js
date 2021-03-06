import React, { useEffect, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../hooks/Authentication'

import { toast, ToastContainer } from 'react-toastify'

import api from '../../services/api';
import { plugin } from '../../services/plugin'

import './styles.css';

import tituloPequenoImg from '../../assets/img/titulo-pequeno.svg';
import cometaImg from '../../assets/img/cometa.svg';
import solImg from '../../assets/img/sol.svg';
import fogueteImg from '../../assets/img/foguete.png';
import jupterImg from '../../assets/img/jupter.svg';

import { Pads, PadsContainer, LogoutButtonContainer } from './styles';
import Pad from '../../components/Pad';
import { Form } from '../../components/Form';

export default function Config() {
  const { Logout, name } = useAuth()

  const [selectedPad, setSelectedPad] = useState({})
  const [pads, setPads] = useState([])

  const [reload, setReload] = useState(false)

  function forceUpdate() {
    setReload(!reload)
  }

  function handleLogout() {
    Logout()
  }

  function showToast(type, message) {
    switch (type) {
      case 'sucess':
        toast.success(message)
        break
      case 'warning':
        toast.warning(message)
        break
      default:
        break
    }
  }

  useEffect(() => {
    async function getPadsData() {
      const response = await api.get('/buttons')
      response.data.sort((a, b) => {
        return a.position - b.position
      })
      setPads(response.data)
    }
    getPadsData()
  }, [reload])

  useEffect(() => {
    async function updatePluginCredentials() {
      await plugin.post('login')
      updateLocalAddress()
    }

    async function updateLocalAddress() {
      const { data } = await plugin.get('localaddress')
      await api.post(`localaddress?&local_address=http://${data.localAddress}:5554`)
    }

    updatePluginCredentials()
  }, [])

  return (
    <>
      <ToastContainer
        position="top-right"
        theme="colored"
        style={{ fontSize: '18px' }}
      />

      <div className="parte1-div">
        <div className="cabeca">
          <div className="welcome-mensager">
            <p>Bem Vindo(a), {name}!</p>
          </div>
            <img className="titulo-pequeno" src={tituloPequenoImg} alt="titulo" />
          <div className="logout">
            <LogoutButtonContainer>
              <button onClick={handleLogout}>
                <p> SAIR</p>
                <FiLogOut color="#FFF" size={24} />
              </button>
            </LogoutButtonContainer>
          </div>
        </div>


        <PadsContainer>
          <Pads>
            {pads && (
              pads.map((pad) =>
                <Pad
                  key={pad.id}
                  data={pad}
                  changeSelectedPad={setSelectedPad}
                  selectedPad={selectedPad}
                />
              )
            )}
          </Pads>
        </PadsContainer>

        <img className="cometa" src={cometaImg} alt="cometa" />
        <img className="sol" src={solImg} alt="sol" />
        <img className="foguete-img" src={fogueteImg} alt="foguete" />
        <img className="jupter-img" src={jupterImg} alt="jupter" />
      </div>

      <div className="parte2-div">
        {
          !!selectedPad.id
          ? <Form pad={selectedPad} update={forceUpdate} showToast={showToast} />
          : <p>Clique em um pad para configurar sua fun????o</p>
        }
      </div>
    </>
  );
}
