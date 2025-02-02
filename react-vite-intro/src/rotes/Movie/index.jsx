import React, {useEffect, useState} from 'react';

import AppBody from "../../components/containers/AppBody/index.jsx";
import Footer from "../../components/containers/Sections/Footer/index.jsx";
import Header from "../../components/containers/Sections/Header/index.jsx";
import AppContainer from "../../components/containers/AppContainer/index.jsx";
import {AutoComplete, Button, DatePicker, Form, Input, message, Modal, Select, Table} from "antd";
import Sort from "../../components/containers/Sections/Sort/index.jsx";
import Filter from "../../components/containers/Sections/Filter/index.jsx";
import dayjs from "dayjs";
import { js2xml } from "xml-js";
import axios from "axios";

// function formatDateTimeString(dateString) {
//     if (!dateString) return null;
//
//     const [datePart, timePart] = dateString.split('T');
//     if (!datePart || !timePart) return dateString;
//
//     const [year, month, day] = datePart.split('-');
//     return `${day}-${month}-${year} ${timePart}`;
// }

// function formatDateString(dateString) {
//     if (!dateString) return null;
//
//
//     const [year, month, day] = dateString.split('-');
//     return `${year}-${month}-${day}`;
// }

function parseSearchResponse(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");

    const movies = Array.from(xmlDoc.getElementsByTagName("movie")).map(movieNode => {
        const id = parseInt(movieNode.getElementsByTagName("id")[0].textContent);
        const name = movieNode.getElementsByTagName("name")[0].textContent;
        const x = parseFloat(movieNode.getElementsByTagName("x")[0].textContent);
        const y = parseFloat(movieNode.getElementsByTagName("y")[0].textContent);
        const coordinates = {x, y};

        // const creationDate = formatDateTimeString(movieNode.getElementsByTagName("creationDate")[0]?.textContent || null);
        const creationDate = movieNode.getElementsByTagName("creationDate")[0]?.textContent || null;

        const oscarsCount = parseInt(movieNode.getElementsByTagName("oscarsCount")[0].textContent);
        const genre = movieNode.getElementsByTagName("genre")[0].textContent;
        const mpaaRating = movieNode.getElementsByTagName("mpaaRating")[0].textContent;

        const screenwriterNode = movieNode.getElementsByTagName("screenwriter")[0];
        const screenwriter = {
            name: screenwriterNode.getElementsByTagName("name")[0].textContent,
            birthday: screenwriterNode.getElementsByTagName("birthday")[0].textContent,
            height: parseFloat(screenwriterNode.getElementsByTagName("height")[0].textContent),
            hairColor: screenwriterNode.getElementsByTagName("hairColor")[0].textContent,
            nationality: screenwriterNode.getElementsByTagName("nationality")[0].textContent
        };

        const duration = parseInt(movieNode.getElementsByTagName("duration")[0].textContent);

        return {id, name, coordinates, creationDate, oscarsCount, genre, mpaaRating, screenwriter, duration};
    });

    const totalPages = parseInt(xmlDoc.getElementsByTagName("totalPages")[0].textContent);

    return {movies, totalPages};
}


function Movie() {

    const [blockedScroll, setBlockedScroll] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isInitialLoad, setInitialLoad] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortParams, setSortParams] = useState("");
    const [isMounted, setMounted] = useState(false);
    const [emptyFilters, setEmptyFilters] = useState([]);
    const [errorMessages, setErrorMessages] = useState({});
    const [filters, setFilters] = useState([{criteria: "id", operator: "EQ", value: ""}]);

    function addToScroll() {
        setBlockedScroll(blockedScroll + 1);
    }

    function removeToScroll() {
        setBlockedScroll(blockedScroll - 1);
    }

    function createFilterXML(filters) {
        const xmlDocument = document.implementation.createDocument("", "", null);
        const root = xmlDocument.createElement("filters");

        for (const element of filters) {
            const filterElement = xmlDocument.createElement("filter");

            const fieldElement = xmlDocument.createElement("field");
            fieldElement.textContent = element.criteria;

            const filterTypeElement = xmlDocument.createElement("filterType");
            filterTypeElement.textContent = element.operator;

            const valueElement = xmlDocument.createElement("value");
            valueElement.textContent = element.value;

            filterElement.appendChild(fieldElement);
            filterElement.appendChild(filterTypeElement);
            filterElement.appendChild(valueElement);

            root.appendChild(filterElement);
        }

        xmlDocument.appendChild(root);
        return new XMLSerializer().serializeToString(xmlDocument);
    }

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            // width: 50,
            align: "center",
            onCell: () => ({
                style: {minWidth: 80, maxWidth: 80},
            }),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 110,
            align: "center",
            onCell: () => ({
                style: {minWidth: 110, maxWidth: 200},
            }),
        },
        {
            title: "Coordinates",
            children: [
                {
                    title: "X",
                    dataIndex: ["coordinates", "x"],
                    key: "coordinates.x",
                    width: 60,
                    align: "center",
                    onCell: () => ({
                        style: {minWidth: 60, maxWidth: 80},
                    }),
                },
                {
                    title: "Y",
                    dataIndex: ["coordinates", "y"],
                    key: "coordinates.y",
                    width: 60,
                    align: "center",
                    onCell: () => ({
                        style: {minWidth: 60, maxWidth: 80},
                    }),
                },
            ],
        },
        {
            title: "Creation date",
            dataIndex: "creationDate",
            key: "creationDate",
            width: 120,
            align: "center",
            onCell: () => ({
                style: {minWidth: 130, maxWidth: 130},
            }),
        },
        {
            title: "Oscars count",
            dataIndex: "oscarsCount",
            key: "oscarsCount",
            width: 80,
            align: "center",
            onCell: () => ({
                style: {minWidth: 80, maxWidth: 80},
            }),
        },
        {
            title: "Genre",
            dataIndex: "genre",
            key: "genre",
            width: 85,
            align: "center",
            onCell: () => ({
                style: {minWidth: 85, maxWidth: 120},
            }),
        },
        {
            title: "Mpaa Rating",
            dataIndex: "mpaaRating",
            key: "mpaaRating",
            width: 80,
            align: "center",
            onCell: () => ({
                style: {minWidth: 80, maxWidth: 80},
            }),
        },
        {
            title: "Screenwriter",
            children: [
                {
                    title: "Name",
                    dataIndex: ["screenwriter", "name"],
                    key: "screenwriter.name",
                    width: 80,
                    align: "center",
                    onCell: () => ({
                        style: {minWidth: 80, maxWidth: 150},
                    }),
                },
                {
                    title: "Birthday",
                    dataIndex: ["screenwriter", "birthday"],
                    key: "screenwriter.birthday",
                    width: 120,
                    align: "center",
                    onCell: () => ({
                        style: {minWidth: 120, maxWidth: 120},
                    }),
                },
                {
                    title: "Height",
                    dataIndex: ["screenwriter", "height"],
                    key: "screenwriter.height",
                    width: 80,
                    align: "center",
                    onCell: () => ({
                        style: {minWidth: 80, maxWidth: 80},
                    }),
                },
                {
                    title: "Hair color",
                    dataIndex: ["screenwriter", "hairColor"],
                    key: "screenwriter.hairColor",
                    width: 70,
                    onCell: () => ({
                        style: {minWidth: 80, maxWidth: 90},
                    }),
                },
                {
                    title: "Nationality",
                    dataIndex: ["screenwriter", "nationality"],
                    key: "screenwriter.nationality",
                    width: 110,
                    align: "center",
                    onCell: () => ({
                        style: {minWidth: 80, maxWidth: 160},
                    }),
                }
            ],
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            width: 90,
            align: "center",
            onCell: () => ({
                style: {minWidth: 80, maxWidth: 80},
            }),
        },
    ];

    const sendInitialXmlRequest = async () => {
        setLoading(true);

        const xmlInput = `
        <FilterRequest>
            <page>${currentPage - 1}</page>
            <pageSize>${pageSize}</pageSize>
        </FilterRequest>
    `;

        try {
            const response = await fetch("http://localhost:8765/api/v1/movies/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/xml",
                },
                body: xmlInput
            });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.statusText}`);
            }

            const responseText = await response.text();
            const {movies, totalPages} = parseSearchResponse(responseText);

            setMovies(movies);
            setTotalCount(totalPages * pageSize);
            setTotalPages(totalPages);

            message.success("Данные успешно получены!");
        } catch (error) {
            message.error(`Ошибка запроса: ${error.message}`);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    };

    const isValidLong = (value) => {
        const longMin = -9223372036854775808n;
        const longMax = 9223372036854775807n;
        try {
            const num = BigInt(value);
            return num >= longMin && num <= longMax;
        } catch {
            return false;
        }
    };

    const isValidInteger = (value) => {
        const intMin = -2147483648;
        const intMax = 2147483647;
        try {
            const num = parseInt(value, 10);
            return num >= intMin && num <= intMax;
        } catch {
            return false;
        }
    };

    const isValidStringLength = (value) => {
        return value.length <= 255;
    };

    const isValidDouble = (value) => {
        const min = -2147483648.0;
        const max = 2147483647.0;
        const maxScale = 5;
        try {
            const num = parseFloat(value);
            if (isNaN(num) || num < min || num > max) {
                return false;
            }
            const decimalPlaces = (value.split('.')[1] || '').length;
            return decimalPlaces <= maxScale;
        } catch {
            return false;
        }
    };

    const validateFilters = () => {
        const newErrors = {};

        filters.forEach((filter) => {
            filters.forEach((filter) => {
                if (!filter.value) {
                    newErrors[filter.id] = "Field can not be empty";
                } else if ((filter.criteria === "id" || filter.criteria === "oscarsCount") && !isValidLong(filter.value)) {
                    newErrors[filter.id] =
                        "Expected an integer number between -9,223,372,036,854,775,808 and 9,223,372,036,854,775,807";
                } else if ((filter.criteria === "coordinates.y" || filter.criteria === "duration") && !isValidInteger(filter.value)) {
                    newErrors[filter.id] =
                        "Expected an integer number between -2,147,483,648 and 2,147,483,647";
                } else if ((filter.criteria === "name" || filter.criteria === "screenwriter.name") && !isValidStringLength(filter.value)) {
                    newErrors[filter.id] =
                        "Value length exceeds maximum allowed limit of 255 characters"
                } else if ((filter.criteria === "coordinates.x" || filter.criteria === "screenwriter.height") && !isValidDouble(filter.value)) {
                    newErrors[filter.id] =
                        "Expected a numeric value between -2,147,483,648 and 2,147,483,647. Maximum 5 decimal places allowed.";
                }
            });
        });

        setErrorMessages(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const sendXmlRequest = async () => {
        if (!validateFilters()) {
            return;
        }

        setLoading(true);

        const xmlInput = `
        <FilterRequest>
            <page>${currentPage - 1}</page>
            <pageSize>${pageSize}</pageSize>
            ${sortParams}
            ${createFilterXML(filters)}
        </FilterRequest>
    `;

        try {
            const response = await fetch("http://localhost:8765/api/v1/movies/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/xml",
                },
                body: xmlInput
            });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.statusText}`);
            }

            const responseText = await response.text();
            const {movies, totalPages} = parseSearchResponse(responseText);

            setMovies(movies);
            setTotalCount(totalPages * pageSize);
            setTotalPages(totalPages);

            message.success("Данные успешно получены!");
        } catch (error) {
            message.error(`Ошибка запроса: ${error.message}`);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    };

    useEffect(() => {
        if (!isMounted) {
            sendInitialXmlRequest();
            setMounted(true);
        }
    }, []);

    function changePageSize(value) {
        setPageSize(value);
        setCurrentPage(1);
        setTotalCount(totalPages * pageSize);
    }


    const handlePageSizeChange = (pageSize) => {
        const numericValue = parseInt(pageSize, 10);
        if (!isNaN(numericValue) && numericValue > 0) {
            changePageSize(numericValue);
        }
    };

    const [options, setOptions] = useState([
        {value: "1"},
        {value: "5"},
        {value: "10"},
        {value: "25"},
        {value: "50"},
    ]);

    function setSortString(params) {
        setSortParams(params.slice());
    }

    function setFilterString(params) {
        setFilters(params.slice());
    }

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [enumOptions, setEnumOptions] = useState({});
    const [loadedEnums, setLoadedEnums] = useState(false);

    const parseEnumResponse = (xml, tag) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "application/xml");
        return Array.from(xmlDoc.getElementsByTagName(tag)).map((node) => node.textContent);
    };

    useEffect(() => {
        if (!loadedEnums) {
            const fetchEnums = async () => {
                setLoading(true);
                try {
                    const responses = await Promise.all([
                        fetch("http://localhost:8765/api/v1/movies/colors").then((res) => res.text()),
                        fetch("http://localhost:8765/api/v1/movies/countries").then((res) => res.text()),
                        fetch("http://localhost:8765/api/v1/movies/genres").then((res) => res.text()),
                        fetch("http://localhost:8765/api/v1/movies/ratings").then((res) => res.text()),
                    ]);

                    const colors = parseEnumResponse(responses[0], "color");
                    const countries = parseEnumResponse(responses[1], "country");
                    const genres = parseEnumResponse(responses[2], "genre");
                    const ratings = parseEnumResponse(responses[3], "rating");

                    setEnumOptions({
                        hairColor: colors,
                        nationality: countries,
                        genre: genres,
                        mpaaRating: ratings,
                    });

                    message.success("Все данные успешно загружены!");
                    setLoadedEnums(true);
                } catch (error) {
                    message.error(`Ошибка загрузки данных: ${error.message}`);
                } finally {
                    setLoading(false);
                }
            };

            fetchEnums();
        }
    }, [loadedEnums]);

    const handleRowClick = (record) => {
        const newRecord = {
            ...record,
            screenwriter: {
                ...record.screenwriter,
                birthday: record.screenwriter?.birthday
                    ? dayjs(record.screenwriter.birthday, "YYYY-MM-DD")
                    : null
            }
        };

        setSelectedMovie(newRecord);
        setIsModalOpen(true);
        form.setFieldsValue(newRecord);
    };

    const handleSave = async () => {
        try {
            console.log("before values");
            const values = await form.validateFields();

            console.log("before movieData");
            console.log(values.creationDate);
            const movieData = {
                Movie: {
                    name: values.name,
                    coordinates: {
                        x: values.coordinates.x,
                        y: values.coordinates.y,
                    },
                    creationDate: selectedMovie.creationDate,
                    oscarsCount: values.oscarsCount,
                    genre: values.genre,
                    mpaaRating: values.mpaaRating,
                    screenwriter: {
                        name: values.screenwriter.name,
                        height: values.screenwriter.height,
                        hairColor: values.screenwriter.hairColor,
                        nationality: values.screenwriter.nationality,
                    },
                    duration: values.duration,
                },
            };

            console.log("before xmlData");
            const xmlData = js2xml(movieData, { compact: true, ignoreComment: true, spaces: 4 });

            const movieId = selectedMovie.id;

            console.log("before response");
            const response = await axios.put(`http://localhost:8765/api/v1/movies/${movieId}`, xmlData, {
                headers: {
                    "Content-Type": "application/xml",
                },
            });

            const responseText = await response.data;
            console.log("Ответ от сервера (XML):", responseText);

            // ✅ Парсим XML в JSON
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(responseText, "text/xml");

            const updatedMovieFromResponse = {
                id: Number(xmlDoc.getElementsByTagName("id")[0].textContent), // Преобразуем в число
                name: xmlDoc.getElementsByTagName("name")[0].textContent,
                coordinates: {
                    x: parseFloat(xmlDoc.getElementsByTagName("x")[0].textContent),
                    y: parseInt(xmlDoc.getElementsByTagName("y")[0].textContent, 10),
                },
                creationDate: xmlDoc.getElementsByTagName("creationDate")[0].textContent,
                oscarsCount: parseInt(xmlDoc.getElementsByTagName("oscarsCount")[0].textContent, 10),
                genre: xmlDoc.getElementsByTagName("genre")[0].textContent,
                mpaaRating: xmlDoc.getElementsByTagName("mpaaRating")[0].textContent,
                screenwriter: {
                    name: xmlDoc.getElementsByTagName("screenwriter")[0].getElementsByTagName("name")[0].textContent,
                    birthday: xmlDoc.getElementsByTagName("screenwriter")[0].getElementsByTagName("birthday")[0]?.textContent || null,
                    height: parseFloat(xmlDoc.getElementsByTagName("screenwriter")[0].getElementsByTagName("height")[0].textContent),
                    hairColor: xmlDoc.getElementsByTagName("screenwriter")[0].getElementsByTagName("hairColor")[0]?.textContent || null,
                    nationality: xmlDoc.getElementsByTagName("screenwriter")[0].getElementsByTagName("nationality")[0]?.textContent || null,
                },
                duration: parseInt(xmlDoc.getElementsByTagName("duration")[0].textContent, 10),
            };

            console.log("Обновлённый фильм (JSON):", updatedMovieFromResponse);

            // ✅ Проверяем, что обновленный фильм корректный
            if (!updatedMovieFromResponse.id) {
                console.error("Ошибка: ID фильма не найден в ответе!");
                return;
            }

            // ✅ Обновляем данные в таблице
            setMovies((prevMovies) => {
                const newMovies = prevMovies.map((movie) =>
                    movie.id === updatedMovieFromResponse.id ? updatedMovieFromResponse : movie
                );

                console.log("Новый список фильмов:", newMovies);
                return newMovies; // Важно вернуть новый массив
            });

            console.log("Success:", response.data);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <AppBody style={{margin: 0, padding: 0}}>
            <Header logo="home" addToScroll={addToScroll} removeToScroll={removeToScroll} tasks={false}>
            </Header>
            {selectedMovie && (
                <Modal
                    title={<div style={{textAlign: "center", width: "100%"}}>Update movie</div>}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                            Отмена
                        </Button>,
                        <Button key="save" type="primary" onClick={handleSave}>
                            Сохранить
                        </Button>,
                    ]}
                    centered
                >
                    <Form form={form} layout="vertical" initialValues={selectedMovie}>
                        <Form.Item label="Name" name="name"
                                   rules={[{required: true, message: 'Please input the name!'}]}>
                            <Input placeholder="Input name" style={{width: "220px"}}/>
                        </Form.Item>
                        <Form.Item label="Coordinate X" name={["coordinates", "x"]}
                                   rules={[{required: true, message: 'Please input coordinate X!'}]}>
                            <Input placeholder="Input coordinate X" style={{width: "220px"}}/>
                        </Form.Item>
                        <Form.Item label="Coordinate Y" name={["coordinates", "y"]}
                                   rules={[{required: true, message: 'Please input coordinate Y!'}]}>
                            <Input placeholder="Input coordinate Y" style={{width: "220px"}}/>
                        </Form.Item>
                        <Form.Item label="Oscars count" name="oscarsCount"
                                   rules={[{required: true, message: 'Please input oscars count!'}]}>
                            <Input placeholder="Input oscars count" style={{width: "220px"}}/>
                        </Form.Item>
                        <Form.Item label="Genre" name="genre"
                                   rules={[{required: true, message: 'Please input genre!'}]}>
                            <Select style={{width: "220px"}}>
                                {enumOptions.genre.map((genre) => (
                                    <Select.Option key={genre} value={genre}>
                                        {genre}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Mpaa rating" name="mpaaRating"
                                   rules={[{required: true, message: 'Please input Mpaa rating!'}]}>
                            <Select style={{width: "220px"}}>
                                {enumOptions.mpaaRating.map((mpaaRating) => (
                                    <Select.Option key={mpaaRating} value={mpaaRating}>
                                        {mpaaRating}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Screenwriter name" name={["screenwriter", "name"]}
                                   rules={[{required: true, message: 'Please input screenwriter name!'}]}>
                            <Input placeholder="Input screenwriter name" style={{width: "220px"}}/>
                        </Form.Item>
                        <Form.Item label="Screenwriter birthday" name={["screenwriter", "birthday"]}>
                            <DatePicker style={{width: "220px"}} format="YYYY-MM-DD"/>
                        </Form.Item>
                        <Form.Item label="Screenwriter height" name={["screenwriter", "height"]}
                                   rules={[{required: true, message: 'Please input screenwriter height!'}]}>
                            <Input placeholder="Input screenwriter height" style={{width: "220px"}}/>
                        </Form.Item>
                        <Form.Item label="Screenwriter hair color" name={["screenwriter", "hairColor"]}>
                            <Select style={{width: "220px"}}>
                                <Select.Option value="">-- Select an option --</Select.Option>
                                {enumOptions.hairColor.map((hairColor) => (
                                    <Select.Option key={hairColor} value={hairColor}>
                                        {hairColor}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Screenwriter nationality" name={["screenwriter", "nationality"]}>
                            <Select style={{width: "220px"}}>
                                <Select.Option value="">-- Select an option --</Select.Option>
                                {enumOptions.nationality.map((nationality) => (
                                    <Select.Option key={nationality} value={nationality}>
                                        {nationality}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Duration" name="duration">
                            <Input placeholder="Input duration" style={{width: "220px"}}/>
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            <AppContainer style={{width: '100%', overflowX: 'auto'}}>
                <Table
                    dataSource={movies}
                    columns={columns}
                    scroll={{x: 1200}}
                    rowKey="id"
                    loading={loading}
                    bordered={true}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                    })}
                    pagination={{
                        total: totalCount,
                        // total: movies.length,
                        pageSize: pageSize,
                        current: currentPage,
                        onChange: (page) => {
                            setCurrentPage(page);
                            // sendXmlRequest();
                        },
                        showTotal: (total, range) => range[0] === pageSize * (currentPage - 1) + movies.length
                            ? `${range[0]} item, page size: ${pageSize}`
                            : `${range[0]}-${pageSize * (currentPage - 1) + movies.length} items, page size: ${pageSize}`
                    }}
                />
                <div className="page__size">
                    <div className="select__box select__pagination">
                        <p>Page Size: </p>
                        <AutoComplete
                            options={options}
                            style={{width: 150}}
                            placeholder="Select or enter"
                            onChange={handlePageSizeChange}
                            filterOption={(inputValue, option) =>
                                option?.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== 0
                            }
                        />
                    </div>
                </div>

                <div className="wrapper sort">
                    <Sort sortUpdate={setSortString}>
                        <Select.Option value="id">ID</Select.Option>
                        <Select.Option value="name">Name</Select.Option>
                        <Select.Option value="coordinates.x">X</Select.Option>
                        <Select.Option value="coordinates.y">Y</Select.Option>
                        <Select.Option value="oscarsCount">Oscars Count</Select.Option>
                        <Select.Option value="genre">Genre</Select.Option>
                        <Select.Option value="mpaaRating">Mpaa Rating</Select.Option>
                        <Select.Option value="screenwriter.name">Screenwriter name</Select.Option>
                        <Select.Option value="screenwriter.birthday">Screenwriter birthday</Select.Option>
                        <Select.Option value="screenwriter.height">Screenwriter height</Select.Option>
                        <Select.Option value="screenwriter.hairColor">Screenwriter hair color</Select.Option>
                        <Select.Option value="screenwriter.nationality">Screenwriter nationality</Select.Option>
                        <Select.Option value="screenwriter.price">Screenwriter price</Select.Option>
                        <Select.Option value="duration">Duration</Select.Option>
                    </Sort>
                </div>

                <div className="wrapper filter">
                    <Filter filtersUpdate={setFilterString}
                            emptyFields={emptyFilters}
                            setEmptyFields={setEmptyFilters}
                            errorMessages={errorMessages}
                            setErrorMessages={setErrorMessages}
                            enumOptions={enumOptions}
                            setEnumOptions={setEnumOptions}>
                        <Select.Option value="id">ID</Select.Option>
                        <Select.Option value="name">Name</Select.Option>
                        <Select.Option value="coordinates.x">X</Select.Option>
                        <Select.Option value="coordinates.y">Y</Select.Option>
                        <Select.Option value="coordinates.y">Y</Select.Option>
                        <Select.Option value="oscarsCount">Oscars Count</Select.Option>
                        <Select.Option value="genre">Genre</Select.Option>
                        <Select.Option value="mpaaRating">Mpaa Rating</Select.Option>
                        <Select.Option value="screenwriter.name">Screenwriter name</Select.Option>
                        <Select.Option value="screenwriter.birthday">Screenwriter birthday</Select.Option>
                        <Select.Option value="screenwriter.height">Screenwriter height</Select.Option>
                        <Select.Option value="hairColor">Screenwriter hair color</Select.Option>
                        <Select.Option value="nationality">Screenwriter nationality</Select.Option>
                        <Select.Option value="screenwriter.price">Screenwriter price</Select.Option>
                        <Select.Option value="duration">Duration</Select.Option>
                    </Filter>
                </div>

                <Button type="primary" onClick={sendXmlRequest} loading={loading} style={{marginTop: "10px"}}>
                    Save filters and sorts
                </Button>
            </AppContainer>
            <Footer/>
        </AppBody>
    );

}

export default Movie;