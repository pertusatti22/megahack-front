import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../../components/header';
import { Map, TileLayer, Marker} from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import api from '../../services/api';

import './style.css';
import Footer from '../../components/footer';

interface IBGEUFResponse{
    sigla: string;
}

interface IBGECityResponse{
    nome: string;
}

const Register = () => {

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0]);
    const [initialPosition, setInitialPosition] = useState<[number,number]>([0,0]);

    const history = useHistory();

    const [formData, setFormData] = useState({
        nameHub: '',
        zipcode: '',
        district: '',
        street: '',
        numberHouse: '',
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position =>{
            const { latitude, longitude } = position.coords;

            setInitialPosition([latitude, longitude]);
        });
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
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

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;
        
        setFormData({...formData, [name]:value})
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        const { nameHub, zipcode, district, street, numberHouse } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;

        const data = new FormData();
            data.append('nameHub', nameHub);
            data.append('zipcode', zipcode);
            data.append('uf', uf);
            data.append('city', city);
            data.append('district', district);
            data.append('street', street);
            data.append('numberHouse', numberHouse);
            data.append('longitude', String(longitude));
            data.append('latitude', String(latitude));

            await api.post('/hubs', data);

            history.push('/');

    }
    
    return (
        <>
            <Header/>
            <div className="formHub" onSubmit={handleSubmit}>
                <form>
                    <h2 className="title">Cadastrar hub</h2>

                    <div className="field">
                        <input 
                            type="text"
                            name="nameHub"
                            id="nameHub"
                            placeholder="Nome do Hub"
                            onChange={handleInputChange}
                            />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <input 
                                type="text"
                                name="zipcode"
                                id="zipcode"
                                placeholder="CEP"
                                onChange={handleInputChange}
                                />
                        </div>
                        <div className="field">
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
                        </div>

                        <div className="field">
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
                        </div>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <input 
                                type="text"
                                name="district"
                                id="district"
                                placeholder="Bairro"
                                onChange={handleInputChange}
                                />
                        </div>
                        <div className="field">
                            <input 
                                type="text"
                                name="street"
                                id="street"
                                placeholder="Rua"
                                onChange={handleInputChange}
                                />
                        </div>
                        <div className="field">
                            <input 
                                type="text"
                                name="numberHouse"
                                id="numberHouse"
                                placeholder="Número"
                                onChange={handleInputChange}
                                />
                        </div>
                    </div>

                        <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={selectedPosition}/>
                        </Map>

                        <button className="iconContainer" type="submit">Cadastrar hub</button>

                </form>
            </div>
            <Footer/>
        </>
    );
};

export default Register;

