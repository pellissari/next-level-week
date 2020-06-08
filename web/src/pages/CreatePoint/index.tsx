import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import logo from '../../assets/logo.svg';
import { FiArrowLeft } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom';
import { LeafletMouseEvent } from 'leaflet';

import { Map, TileLayer, Marker } from 'react-leaflet';

import DropZone from '../../components/Dropzone';

import './styles.css';

import api from '../../services/api';

interface Item {
    id: number,
    title: string,
    image_url: string
}

interface Uf {
    sigla: string
}

interface City {
    id: number,
    nome: string
}

const CreatePoint = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<Uf[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [formData, setFormdata] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });
    const [selectedItems, setselectedItems] = useState<number[]>([]);

    const [selectedFile, setSelectedFile] = useState<File>();
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedMapPosition, setSelectedMapPosition] = useState<[number, number]>([0, 0]);

    const history = useHistory();

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, []);


    useEffect(() => {
        api.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                setUfs(response.data)
            })

    }, [])


    useEffect(() => {
        api.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                setCities(response.data)
            })

    }, [selectedUf])

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value);
    };

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value);
    };

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedMapPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormdata({ ...formData, [name]: value });
    }

    function handleSelectedItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setselectedItems(filteredItems);
        } else {
            setselectedItems([...selectedItems, id])
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();



        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedMapPosition;
        const items = selectedItems;

        const data = new FormData();
        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));

        if (selectedFile) {
            data.append('image', selectedFile);
        }



        console.log(data);

        await api.post('/points', data);

        alert('Cadastrado');

        history.push('/');
    }
    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <span>
                        <FiArrowLeft />
                    </span>
                    <strong>Voltar para home</strong>
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <DropZone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail da entidade</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>



                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Edereço</h2>
                        <span>selecione o endereço no mapa</span>
                    </legend>

                    <Map
                        center={[-23.5648683, -46.5451525]}
                        zoom={15}
                        onClick={handleMapClick}
                    >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedMapPosition} />

                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select name="uf" id="uf" onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option
                                        key={uf.sigla}
                                        value={uf.sigla}>{uf.sigla}
                                    </option>
                                )

                                )}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" onChange={handleSelectCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option
                                        key={city.nome}
                                        value={city.nome}>{city.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de Coleta</h2>
                        <span>selecione um pou mais itens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id}
                                onClick={() => handleSelectedItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}

                    </ul>
                </fieldset>
                <button type="submit">
                    Cadastrar ponto de coleta
                </button>

            </form>

        </div>
    );
};

export default CreatePoint;