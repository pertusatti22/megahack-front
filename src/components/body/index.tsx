import React, { useState, useEffect, ChangeEvent } from 'react';
import { FiSearch} from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Map, TileLayer} from 'react-leaflet';
import banner from '../../assets/65932.jpg';

import './style.css';

interface IBGEUFResponse{
    sigla: string;
}

interface IBGECityResponse{
    nome: string;
}

const Body = () => {

    const history = useHistory();

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number,number]>([0,0]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position =>{
            const { latitude, longitude } = position.coords;

            setInitialPosition([latitude, longitude]);
        });
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);

            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
        //carregar as cidades sempre que a UF mudar
        if(selectedUf === '0'){
            return;
        }

        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
            const cityNames = response.data.map(city => city.nome);

            setCities(cityNames);
        });
    }, [selectedUf]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;

        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;

        setSelectedCity(city);
    }

    function handleNavigationToPoints(){
        const uf = selectedUf;
        const city = selectedCity;

        history.push('/', {
            uf,
            city,
        });
      }

 return (
    <>
        <div className="image">
            <img src={banner} className="bannerImg" alt="Banner Safe's Hub"/>
        </div>
        <h2 className="title">Procure o Hub mais próximo de você</h2>
        <div className="selectContainer">
            <div className="div-select">
                <select 
                    name="uf" 
                    id="uf" 
                    value={selectedUf} 
                    onChange={handleSelectUf}>
                    <option  >Selecione uma UF</option>
                    {ufs.map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                    ))}
                </select> 
            </div>
            <div className="div-select2">
                <select 
                    name="city" 
                    id="city"
                    value={selectedCity}
                    onChange={handleSelectCity}>
                    <option value="0">Selecione uma cidade</option>
                    {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>
            <button className="iconContainer" onClick={handleNavigationToPoints}>Buscar <FiSearch /></button>

        </div>
        <Map center={initialPosition} zoom={15}>
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </Map>
    </>
 );
}

export default Body;