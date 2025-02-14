import React, {useEffect, useState} from 'react';

import AppBody from "../../components/containers/AppBody/index.jsx";
import Footer from "../../components/containers/Sections/Footer/index.jsx";
import Header from "../../components/containers/Sections/Header/index.jsx";
import AppContainer from "../../components/containers/AppContainer/index.jsx";
import {AutoComplete, Button, DatePicker, Form, Input, message, Modal, notification, Select, Table} from "antd";
import Sort from "../../components/containers/Sections/Sort/index.jsx";
import Filter from "../../components/containers/Sections/Filter/index.jsx";
import dayjs from "dayjs";
import {js2xml} from "xml-js";
import axios from "axios";
import {XMLParser} from "fast-xml-parser";

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

function parseAwardResponse(xml) {
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

    return movies;
}

function Movie() {

    const [blockedScroll, setBlockedScroll] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortParams, setSortParams] = useState("");
    const [isMounted, setMounted] = useState(false);
    const [emptyFilters, setEmptyFilters] = useState([]);
    const [errorMessages, setErrorMessages] = useState({});
    const [filters, setFilters] = useState([{criteria: "id", operator: "EQ", value: ""}]);
    const [loadedEnums, setLoadedEnums] = useState(false);
    const [filterChange, setFilterChange] = useState(false);
    const [sortChange, setSortChange] = useState(false);
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
                    width: 90,
                    align: "center",
                    onCell: () => ({
                        style: {minWidth: 90, maxWidth: 90},
                    }),
                },
                {
                    title: "Hair color",
                    dataIndex: ["screenwriter", "hairColor"],
                    key: "screenwriter.hairColor",
                    width: 70,
                    align: "center",
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
    const [options, setOptions] = useState([
        {value: "1"},
        {value: "5"},
        {value: "10"},
        {value: "25"},
        {value: "50"},
    ]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movieToCreate, setMovieToCreate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [isModalAwardOpen, setIsModalAwardOpen] = useState(false);
    const [form] = Form.useForm();
    const [formCreate] = Form.useForm();
    const [formAward] = Form.useForm();
    const [enumOptions, setEnumOptions] = useState({
        "screenwriter.hairColor": [""],
        "screenwriter.nationality": [""],
        genre: [""],
        mpaaRating: [""],
    });

    useEffect(() => {
        if (!isMounted) {
            sendInitialXmlRequest();
            setMounted(true);
        }
    }, []);

    useEffect(() => {
        if (!loadedEnums) {
            const fetchEnums = async () => {
                setLoading(true);
                try {
                    const responses = await Promise.all([
                        fetch("https://localhost:8765/movie/api/v1/movies/colors").then((res) => res.text()),
                        fetch("https://localhost:8765/movie/api/v1/movies/countries").then((res) => res.text()),
                        fetch("https://localhost:8765/movie/api/v1/movies/genres").then((res) => res.text()),
                        fetch("https://localhost:8765/movie/api/v1/movies/ratings").then((res) => res.text()),
                    ]);

                    const colors = parseEnumResponse(responses[0], "color");
                    const countries = parseEnumResponse(responses[1], "country");
                    const genres = parseEnumResponse(responses[2], "genre");
                    const ratings = parseEnumResponse(responses[3], "rating");

                    setEnumOptions({
                        "screenwriter.hairColor": colors,
                        "screenwriter.nationality": countries,
                        genre: genres,
                        mpaaRating: ratings,
                    });

                    // notification.success({
                    //     message: 'Data uploaded successfully',
                    //     // description: 'Фильм был успешно удалён из базы данных.',
                    //     placement: 'topRight',
                    // });
                    setLoadedEnums(true);
                } catch (error) {
                    notification.error({
                        message: `Data upload error: ${error.message}`,
                        // description: 'Фильм был успешно удалён из базы данных.',
                        placement: 'topRight',
                    });
                    // message.error(`Ошибка загрузки данных: ${error.message}`);
                } finally {
                    setLoading(false);
                }
            };

            fetchEnums();
        }
    }, [loadedEnums]);

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

    const sendInitialXmlRequest = async () => {
        setLoading(true);

        const xmlInput = `
        <FilterRequest>
            <page>${currentPage - 1}</page>
            <pageSize>${pageSize}</pageSize>
        </FilterRequest>`;

        try {
            const response = await fetch("https://localhost:8765/movie/api/v1/movies/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/xml",
                },
                body: xmlInput
            });

            if (!response.ok) {
                if (response.status === 404) {
                    notification.info({
                        message: "Data not found",
                        // description: 'Фильм был успешно удалён из базы данных.',
                        placement: 'topRight',
                    });
                    return;
                } else {
                    notification.error({
                        message: "Server error",
                        // description: 'Фильм был успешно удалён из базы данных.',
                        placement: 'topRight',
                    });
                    return;
                }
            }

            const responseText = await response.text();
            const {movies, totalPages} = parseSearchResponse(responseText);

            if (movies.length === 0) {
                notification.info({
                    message: "Data not found",
                    // description: 'Фильм был успешно удалён из базы данных.',
                    placement: 'topRight',
                });
                return;
            }

            setMovies(movies);
            setTotalCount(totalPages * pageSize);
            setTotalPages(totalPages);
            setFilterChange(false);
            setSortChange(false);

            notification.success({
                message: "Data uploaded successfully",
                // description: 'Фильм был успешно удалён из базы данных.',
                placement: 'topRight',
            });
        } catch (error) {
            notification.error({
                message: `Data upload error`,
                // description: 'Фильм был успешно удалён из базы данных.',
                placement: 'topRight',
            });
            // message.error(`Ошибка запроса: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const isValidLong = (value) => {
        // const longMin = BigInt("-9223372036854775808");
        const longMin = BigInt("0");
        const longMax = BigInt("9223372036854775807");

        if (typeof value !== "string" && typeof value !== "number") return false;

        const strValue = value.toString().trim();

        if (!/^-?\d+$/.test(strValue)) return false;

        try {
            const num = BigInt(strValue);
            return num >= longMin && num <= longMax;
        } catch {
            return false;
        }
    };

    const isValidInteger = (value) => {
        const intMin = -2147483648;
        const intMax = 2147483647;

        if (typeof value !== "string" && typeof value !== "number") return false;

        const strValue = value.toString().trim();

        if (!/^-?\d+$/.test(strValue)) return false;

        try {
            const num = parseInt(strValue, 10);
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

        if (typeof value !== "string" && typeof value !== "number") return false;

        const strValue = value.toString().trim();

        if (!/^-?\d+(\.\d+)?$/.test(strValue)) return false;

        try {
            const num = parseFloat(value);
            if (isNaN(num) || num < min || num > max) {
                return false;
            }

            const decimalPlaces = num.toString().includes(".")
                ? num.toString().split(".")[1].length
                : 0;

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
                } else if ((filter.criteria === "id") && !isValidLong(filter.value)) {
                    newErrors[filter.id] =
                        "Expected an integer number between 1 and 9,223,372,036,854,775,807";
                } else if (filter.criteria === "oscarsCount" && (!isValidLong(filter.value) || filter.value < 0)) {
                    newErrors[filter.id] =
                        "Expected an integer number between 0 and 9,223,372,036,854,775,807";
                } else if (filter.criteria === "coordinates.y" && !isValidInteger(filter.value)) {
                    newErrors[filter.id] =
                        "Expected an integer number between -2,147,483,648 and 2,147,483,647";
                } else if (filter.criteria === "duration" && (!isValidInteger(filter.value) || filter.value <= 0)) {
                    newErrors[filter.id] =
                        "Expected an integer number between 1 and 2,147,483,647";
                } else if ((filter.criteria === "name" || filter.criteria === "screenwriter.name") && !isValidStringLength(filter.value)) {
                    newErrors[filter.id] =
                        "Value length exceeds maximum allowed limit of 255 characters"
                } else if (filter.criteria === "coordinates.x" && !isValidDouble(filter.value)) {
                    newErrors[filter.id] =
                        "Expected a numeric value between -2,147,483,648 and 2,147,483,647. Maximum 5 decimal places allowed.";
                } else if (filter.criteria === "screenwriter.height" && (!isValidDouble(filter.value) || filter.value < 0)) {
                    newErrors[filter.id] =
                        "Expected a numeric value between 0 and 2,147,483,647. Maximum 5 decimal places allowed.";
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
        setCurrentPage(0);

        const xmlInput = `
        <FilterRequest>
            <page>0</page>
            <pageSize>${pageSize}</pageSize>
            ${sortParams}
            ${createFilterXML(filters)}
        </FilterRequest>`;

        try {
            const response = await fetch("https://localhost:8765/movie/api/v1/movies/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/xml",
                },
                body: xmlInput
            });

            if (!response.ok) {
                if (response.status === 404) {
                    notification.info({
                        message: "Data not found",
                        // description: 'Фильм был успешно удалён из базы данных.',
                        placement: 'topRight',
                    });
                    return;
                } else {
                    notification.error({
                        message: "Server error",
                        // description: 'Фильм был успешно удалён из базы данных.',
                        placement: 'topRight',
                    });
                    return;
                }
            }

            const responseText = await response.text();
            const {movies, totalPages} = parseSearchResponse(responseText);

            if (movies.length === 0) {
                notification.info({
                    message: "Data not found",
                    // description: 'Фильм был успешно удалён из базы данных.',
                    placement: 'topRight',
                });
                return;
            }

            setMovies(movies);
            setTotalCount(totalPages * pageSize);
            setTotalPages(totalPages);

            setFilterChange(false);
            setSortChange(false);

            // message.success("Данные успешно получены!");
            notification.success({
                message: "Data uploaded successfully",
                description: 'Data found according filters and sorts',
                placement: 'topRight',
            });
        } catch (error) {
            notification.error({
                message: `Data upload error: ${error.message}`,
                // description: 'Фильм был успешно удалён из базы данных.',
                placement: 'topRight',
            });
            // message.error(`Ошибка запроса: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    function setSortString(params) {
        setSortParams(params.slice());
    }

    function setFilterString(params) {
        setFilters(params.slice());
    }

    function setFilterChangeValue(params) {
        setFilterChange(params);
    }

    function setSortChangeValue(params) {
        setSortChange(params);
    }

    const parseEnumResponse = (xml, tag) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "application/xml");
        return Array.from(xmlDoc.getElementsByTagName(tag)).map((node) => node.textContent);
    };

    const handleRowClick = (record) => {
        // const newRecord = {
        //     ...record,
        //     screenwriter: {
        //         ...record.screenwriter,
        //         // birthday: record.screenwriter?.birthday
        //         //     ? dayjs(record.screenwriter.birthday, "YYYY-MM-DD")
        //         //     : null
        //     }
        // };

        setSelectedMovie(record);
        setIsModalOpen(true);
        form.setFieldsValue(record);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (!values) return;

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
                        birthday: values.screenwriter.birthday,
                        hairColor: values.screenwriter.hairColor,
                        nationality: values.screenwriter.nationality,
                    },
                    duration: values.duration,
                },
            };

            const xmlData = js2xml(movieData, {compact: true, ignoreComment: true, spaces: 4});

            const movieId = selectedMovie.id;

            const response = await axios.put(`https://localhost:8765/movie/api/v1/movies/${movieId}`, xmlData, {
                headers: {
                    "Content-Type": "application/xml",
                },
            });

            const responseText = await response.data;

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

            if (!updatedMovieFromResponse.id) {
                console.error("Ошибка: ID фильма не найден в ответе!");
                return;
            }

            setMovies((prevMovies) => {
                const newMovies = prevMovies.map((movie) =>
                    movie.id === updatedMovieFromResponse.id ? updatedMovieFromResponse : movie
                );

                console.log("Новый список фильмов:", newMovies);
                return newMovies;
            });

            console.log("Success:", response.data);
            notification.success({
                message: 'Movie updated successfully',
                // description: 'Фильм был успешно удалён из базы данных.',
                placement: 'topRight',
            });

            setIsModalOpen(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCreateSave = async () => {
        try {
            const values = await formCreate.validateFields();

            console.log(values);

            if (!values) return;

            console.log("after if");

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
                        birthday: values.screenwriter.birthday,
                        hairColor: values.screenwriter.hairColor,
                        nationality: values.screenwriter.nationality,
                    },
                    duration: values.duration,
                },
            };

            console.log(movieData);

            const xmlData = js2xml(movieData, {compact: true, ignoreComment: true, spaces: 4});

            console.log(xmlData);

            const response = await axios.post(`https://localhost:8765/movie/api/v1/movies`, xmlData, {
                headers: {
                    "Content-Type": "application/xml",
                },
            });

            const responseText = await response.data;

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(responseText, "text/xml");

            const createdMovieFromResponse = {
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

            console.log("Созданный фильм (JSON):", createdMovieFromResponse);

            if (!createdMovieFromResponse.id) {
                console.error("Ошибка: ID фильма не найден в ответе!");
                return;
            }

            // setMovies((prevMovies) => {
            //     const newMovies = prevMovies.map((movie) =>
            //         movie.id === createdMovieFromResponse.id ? createdMovieFromResponse : movie
            //     );
            //
            //     console.log("Новый список фильмов:", newMovies);
            //     return newMovies;
            // });


            console.log("Success:", response.data);
            notification.success({
                message: 'Movie created successfully',
                // description: 'Фильм был успешно удалён из базы данных.',
                placement: 'topRight',
            });

            formCreate.resetFields();

            setIsModalCreateOpen(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleAwardSave = async () => {
        try {
            const values = await formAward.validateFields();
            const minLength = values.duration;

            if (!minLength || isNaN(minLength)) {
                return;
            }

            const response = await axios.patch(
                `https://localhost:9091/oscar/api/v1/oscar/movies/honor-by-length/${minLength}/oscars-to-add`,
                {},
                {
                    headers: {
                        "Content-Type": "application/xml"
                    }
                }
            );

            const movies = parseAwardResponse(response.data);

            notification.success({
                message: "Movies awarded successfully",
                description: `Amount of awarded movies – ${movies.length}`,
                placement: "topRight",
            });

            handleAwardCancel();
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    notification.info({
                        message: "No movies found to award",
                        // description: "Фильмы не найдены для обновления.",
                        placement: "topRight",
                    });
                } else {
                    notification.error({
                        message: `Server Error`,
                        // description: error.response.data?.message || "Произошла ошибка при обновлении.",
                        placement: "topRight",
                    });
                }
            }
        }
    };

    const handleDelete = async () => {
        try {
            const movieId = selectedMovie.id;
            const response = await axios.delete(`https://localhost:8765/movie/api/v1/movies/${movieId}`);

            if (response.status === 204) {
                console.log("Фильм успешно удалён");

                setMovies((prevMovies) => {
                    const updatedMovies = prevMovies.filter((movie) => movie.id !== movieId);
                    return updatedMovies;
                });

                notification.success({
                    message: 'Movie deleted successfully',
                    // description: 'Фильм был успешно удалён из базы данных.',
                    placement: 'topRight',
                });

                setIsModalOpen(false);
            } else {
                console.error("Ошибка при удалении фильма");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const showAddModal = () => {

        const movie = {
            Movie: {
                name: "",
                coordinates: {
                    x: null,
                    y: null,
                },
                creationDate: null,
                oscarsCount: "",
                genre: "",
                mpaaRating: null,
                screenwriter: {
                    name: "",
                    height: null,
                    hairColor: "",
                    nationality: "",
                },
                duration: null,
            },
        };
        setSelectedMovie(movie);
        setIsModalCreateOpen(true);
        setMovieToCreate(movie);
        formCreate.setFieldsValue(movie);
    };

    const showAwardModal = () => {

        setIsModalAwardOpen(true);
    };

    const handleCancel = () => {
        const movie = {
            Movie: {
                name: "",
                coordinates: {
                    x: null,
                    y: null,
                },
                creationDate: null,
                oscarsCount: "",
                genre: "",
                mpaaRating: null,
                screenwriter: {
                    name: "",
                    height: null,
                    hairColor: "",
                    nationality: "",
                },
                duration: null,
            },
        };
        setMovieToCreate(movie);
        setIsModalCreateOpen(false);
        formCreate.resetFields();
    };

    const handleAwardCancel = () => {
        setIsModalAwardOpen(false);
        formAward.resetFields();
    };

    const sendXmlRequestPagination = async (page, size) => {
        if (!validateFilters()) {
            return;
        }

        setLoading(true);

        const xmlInput = `
        <FilterRequest>
            <page>${page - 1}</page>
            <pageSize>${size}</pageSize>
            ${sortParams}
            ${createFilterXML(filters)}
        </FilterRequest>`;

        try {
            const response = await fetch("https://localhost:8765/movie/api/v1/movies/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/xml",
                },
                body: xmlInput
            });

            if (!response.ok) {
                if (response.status === 404) {
                    notification.info({
                        message: "Data not found",
                        // description: 'Фильм был успешно удалён из базы данных.',
                        placement: 'topRight',
                    });
                    return;
                } else {
                    notification.error({
                        message: "Server error",
                        // description: 'Фильм был успешно удалён из базы данных.',
                        placement: 'topRight',
                    });
                    return;
                }
            }

            const responseText = await response.text();
            // if (!response.ok) {
            //     const parser = new XMLParser();
            //     const jsonObj = parser.parse(responseText);
            //     const errorMessage = jsonObj?.Error?.message || "Unknown error";
            //
            //     notification.error({
            //         message: `Error ${response.status}: ${errorMessage}`,
            //         placement: "topRight",
            //     });
            //     return;
            // }

            const { movies, totalPages } = parseSearchResponse(responseText);

            if (movies.length === 0) {
                notification.info({
                    message: "Data not found",
                    // description: 'Фильм был успешно удалён из базы данных.',
                    placement: 'topRight',
                });
                return;
            }

            setMovies(movies);
            setTotalCount(totalPages * size);
            setTotalPages(totalPages);

            setFilterChange(false)
            setSortChange(false)

            notification.success({
                message: "Data uploaded successfully",
                placement: "topRight",
            });
        } catch (error) {
            notification.error({
                message: `Data upload error: ${error.message}`,
                placement: "topRight",
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page, pageSize) => {
        console.log(" handlePageChange page" + page)
        console.log(" handlePageChange pageSize" + pageSize)
        if (!validateFilters()) {
            return;
        }
        console.log(filterChange)
        if (filterChange) {
            page = 1;
        }
        setCurrentPage(page);
        sendXmlRequestPagination(page, pageSize);
    };

    const handlePageSizeChange = (current, size) => {
        console.log("current" + current)
        console.log("size" + size)
        if (!validateFilters()) {
            return;
        }
        setPageSize(size);
        setCurrentPage(1);
    };

    return (
        <AppBody style={{margin: 0, padding: 0}}>
            <Header logo="home" addToScroll={addToScroll} removeToScroll={removeToScroll} tasks={false}>
            </Header>
            <div style={{display: "flex", justifyContent: "space-between", width: "100%", marginLeft: 100}}>
                <Button type="primary" onClick={showAddModal} style={{marginBottom: 5, marginTop: 5}}>
                    Create movie
                </Button>
                <Button type="primary" onClick={showAwardModal} style={{marginBottom: 5, marginTop: 5, marginRight: 100}}>
                   Award
                </Button>
            </div>
            <Modal
                title={<div style={{textAlign: "center", width: "100%"}}>Award additionally</div>}
                open={isModalAwardOpen}
                onCancel={() => handleAwardCancel()}
                footer={[
                    <Button key="cancel" onClick={() => handleAwardCancel()}>
                        Cancel
                    </Button>,
                    <Button key="save" type="primary" onClick={handleAwardSave}>
                        Award
                    </Button>,
                ]}
                centered
            >
                <Form form={formAward} layout="vertical">
                    <Form.Item label="Minimal duration to award (minutes)" name="duration"
                               rules={[
                                   {required: true, message: "Please input the duration!", whitespace: true},
                                   {
                                       validator: (_, value) => {
                                           if (value && (!isValidInteger(value) || value < 0)) {
                                               return Promise.reject("Expected an integer number between 0 and 2,147,483,647!");
                                           }
                                           return Promise.resolve();
                                       },
                                   },
                               ]}>
                        <Input placeholder="Input amount of minutes" style={{width: "220px"}}/>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title={<div style={{textAlign: "center", width: "100%"}}>Create movie</div>}
                open={isModalCreateOpen}
                onCancel={() => handleCancel()}
                footer={[
                    <Button key="cancel" onClick={() => handleCancel()}>
                        Cancel
                    </Button>,
                    <Button key="save" type="primary" onClick={handleCreateSave}>
                        Save
                    </Button>,
                ]}
                centered
            >
                <Form form={formCreate} layout="vertical" initialValues={movieToCreate}>
                    <Form.Item label="Name" name="name"
                               rules={[
                                   {required: true, message: "Please input the name!", whitespace: true},
                                   {
                                       validator: (_, value) => {
                                           if (value && !isValidStringLength(value)) {
                                               return Promise.reject("Value length exceeds maximum allowed limit of 255 characters!");
                                           }
                                           return Promise.resolve();
                                       },
                                   },
                               ]}>
                        <Input placeholder="Input name" style={{width: "220px"}}/>
                    </Form.Item>
                    <Form.Item
                        label="Coordinate X"
                        name={["coordinates", "x"]}
                        rules={[
                            {required: true, message: "Please input coordinate X!"},
                            {
                                validator: (_, value) =>
                                    value && !isValidDouble(value)
                                        ? Promise.reject("Expected a numeric value between -2,147,483,648 and 2,147,483,647. Maximum 5 decimal places allowed!")
                                        : Promise.resolve(),
                            },
                        ]}
                    >
                        <Input placeholder="Input coordinate X" style={{width: "220px"}}/>
                    </Form.Item>
                    <Form.Item label="Coordinate Y" name={["coordinates", "y"]}
                               rules={[
                                   {required: true, message: "Please input coordinate Y!"},
                                   {
                                       validator: (_, value) => {
                                           if (value && !isValidInteger(value)) {
                                               return Promise.reject("Expected an integer number between -2,147,483,648 and 2,147,483,647!");
                                           }
                                           return Promise.resolve();
                                       },
                                   },
                               ]}>
                        <Input placeholder="Input coordinate Y" style={{width: "220px"}}/>
                    </Form.Item>
                    <Form.Item label="Oscars count" name="oscarsCount"
                               rules={[
                                   {required: true, message: "Please input oscars count!"},
                                   {
                                       validator: (_, value) => {
                                           if (value && (!isValidLong(value) || value < 0)) {
                                               return Promise.reject("Expected an integer number between 0 and 9,223,372,036,854,775,807!");
                                           }
                                           return Promise.resolve();
                                       },
                                   },
                               ]}>
                        <Input placeholder="Input oscars count" style={{width: "220px"}}/>
                    </Form.Item>
                    <Form.Item label="Genre" name="genre"
                               rules={[{required: true, message: 'Please input genre!'}]}>
                        <Select style={{width: "220px"}} placeholder="Select an option">
                            {enumOptions.genre.map((genre) => (
                                <Select.Option key={genre} value={genre}>
                                    {genre}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Mpaa rating" name="mpaaRating"
                               rules={[{required: true, message: 'Please input Mpaa rating!'}]}>
                        <Select style={{width: "220px"}} placeholder="Select an option">
                            {enumOptions.mpaaRating.map((mpaaRating) => (
                                <Select.Option key={mpaaRating} value={mpaaRating}>
                                    {mpaaRating}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Screenwriter name" name={["screenwriter", "name"]}
                               rules={[
                                   {required: true, message: "Please input screenwriter name!", whitespace: true},
                                   {
                                       validator: (_, value) => {
                                           if (!isValidStringLength(value)) {
                                               return Promise.reject("Value length exceeds maximum allowed limit of 255 characters!");
                                           }
                                           return Promise.resolve();
                                       },
                                   },
                               ]}>
                        <Input placeholder="Input screenwriter name" style={{width: "220px"}}/>
                    </Form.Item>
                    {/*<Form.Item label="Screenwriter birthday" name={["screenwriter", "birthday"]}>*/}
                    {/*    <DatePicker style={{width: "220px"}} format="YYYY-MM-DD"/>*/}
                    {/*</Form.Item>*/}
                    <Form.Item
                        label="Screenwriter birthday"
                        name={["screenwriter", "birthday"]}
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (!value || !dayjs.isDayjs(value)) {
                                        return Promise.resolve();
                                    }
                                    const today = dayjs().startOf("day");
                                    return value.isAfter(today)
                                        ? Promise.reject("Birthday must be before today!")
                                        : Promise.resolve();
                                },
                            },
                        ]}
                        getValueProps={(value) => ({
                            value: value ? dayjs(value, "YYYY-MM-DD") : null,
                        })}
                        getValueFromEvent={(value) => (value ? value.format("YYYY-MM-DD") : null)}
                    >
                        <DatePicker
                            style={{width: "220px"}}
                            format="YYYY-MM-DD"
                            disabledDate={(current) => current && current.isAfter(dayjs().startOf("day"))}
                        />
                    </Form.Item>
                    <Form.Item label="Screenwriter height" name={["screenwriter", "height"]}
                               rules={[
                                   {required: true, message: "Please input screenwriter height!"},
                                   {
                                       validator: (_, value) => {
                                           if (value && (!isValidDouble(value) || value <= 0)) {
                                               return Promise.reject("Expected a numeric value between 0 (not included) and 2,147,483,647. Maximum 5 decimal places allowed!");
                                           }
                                           return Promise.resolve();
                                       },
                                   },
                               ]}>
                        <Input placeholder="Input screenwriter height" style={{width: "220px"}}/>
                    </Form.Item>
                    <Form.Item label="Screenwriter hair color" name={["screenwriter", "hairColor"]}>
                        <Select style={{width: "220px"}} placeholder="Select an option">
                            <Select.Option value="">-- Select an option --</Select.Option>
                            {enumOptions["screenwriter.hairColor"] && enumOptions["screenwriter.hairColor"].map((hairColor) => (
                                <Select.Option key={hairColor} value={hairColor}>
                                    {hairColor}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Screenwriter nationality" name={["screenwriter", "nationality"]}>
                        <Select style={{width: "220px"}} placeholder="Select an option">
                            <Select.Option value="">-- Select an option --</Select.Option>
                            {enumOptions["screenwriter.nationality"] && enumOptions["screenwriter.nationality"].map((nationality) => (
                                <Select.Option key={nationality} value={nationality}>
                                    {nationality}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Duration" name="duration"
                               rules={[
                                   {required: true, message: "Please input duration!"},
                                   {
                                       validator: (_, value) => {
                                           if (value && (!isValidInteger(value) || value <= 0)) {
                                               return Promise.reject("Expected an integer number between 1 and 2,147,483,647!");
                                           }
                                           return Promise.resolve();
                                       },
                                   },
                               ]}>
                        <Input placeholder="Input duration" style={{width: "220px"}}/>
                    </Form.Item>
                </Form>
            </Modal>
            {selectedMovie && (
                <Modal
                    title={<div style={{textAlign: "center", width: "100%"}}>Update movie</div>}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>,
                        <Button key="save" type="primary" onClick={handleSave}>
                            Save
                        </Button>,
                        <Button key="delete" type="danger"
                                style={{
                                    backgroundColor: "#f5222d",
                                    borderColor: "#f5222d",
                                    color: "white",
                                    fontWeight: "bold",
                                    ":hover": {
                                        backgroundColor: "#d92f1e",
                                        borderColor: "#d92f1e",
                                    },
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "#ff4d4f";
                                    e.target.style.borderColor = "#ff4d4f";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "#f5222d";
                                    e.target.style.borderColor = "#f5222d";
                                }}
                                onClick={handleDelete}>
                            Delete
                        </Button>,
                    ]}
                    centered
                >
                    <Form form={form} layout="vertical" initialValues={selectedMovie}>
                        <Form.Item label="Name" name="name"
                                   rules={[
                                       {required: true, message: "Please input the name!", whitespace: true},
                                       {
                                           validator: (_, value) => {
                                               if (value && !isValidStringLength(value)) {
                                                   return Promise.reject("Value length exceeds maximum allowed limit of 255 characters!");
                                               }
                                               return Promise.resolve();
                                           },
                                       },
                                   ]}>
                            <Input placeholder="Input name" style={{width: "220px"}}/>
                        </Form.Item>
                        <Form.Item
                            label="Coordinate X"
                            name={["coordinates", "x"]}
                            rules={[
                                {required: true, message: "Please input coordinate X!"},
                                {
                                    validator: (_, value) =>
                                        value && !isValidDouble(value)
                                            ? Promise.reject("Expected a numeric value between -2,147,483,648 and 2,147,483,647. Maximum 5 decimal places allowed!")
                                            : Promise.resolve(),
                                },
                            ]}
                        >
                            <Input placeholder="Input coordinate X" style={{width: "220px"}}/>
                        </Form.Item>
                        <Form.Item label="Coordinate Y" name={["coordinates", "y"]}
                                   rules={[
                                       {required: true, message: "Please input coordinate Y!"},
                                       {
                                           validator: (_, value) => {
                                               if (value && !isValidInteger(value)) {
                                                   return Promise.reject("Expected an integer number between -2,147,483,648 and 2,147,483,647!");
                                               }
                                               return Promise.resolve();
                                           },
                                       },
                                   ]}>
                            <Input placeholder="Input coordinate Y" style={{width: "220px"}}/>
                        </Form.Item>
                        <Form.Item label="Oscars count" name="oscarsCount"
                                   rules={[
                                       {required: true, message: "Please input oscars count!"},
                                       {
                                           validator: (_, value) => {
                                               if (value && !isValidLong(value)) {
                                                   return Promise.reject("Expected an integer number between -9,223,372,036,854,775,808 and 9,223,372,036,854,775,807!");
                                               }
                                               return Promise.resolve();
                                           },
                                       },
                                   ]}>
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
                                   rules={[
                                       {required: true, message: "Please input screenwriter name!", whitespace: true},
                                       {
                                           validator: (_, value) => {
                                               if (!isValidStringLength(value)) {
                                                   return Promise.reject("Value length exceeds maximum allowed limit of 255 characters!");
                                               }
                                               return Promise.resolve();
                                           },
                                       },
                                   ]}>
                            <Input placeholder="Input screenwriter name" style={{width: "220px"}}/>
                        </Form.Item>
                        <Form.Item
                            label="Screenwriter birthday"
                            name={["screenwriter", "birthday"]}
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (!value || !dayjs.isDayjs(value)) {
                                            return Promise.resolve();
                                        }
                                        const today = dayjs().startOf("day");
                                        return value.isAfter(today) // Запрещаем сегодня и будущее
                                            ? Promise.reject("Birthday must be before today!")
                                            : Promise.resolve();
                                    },
                                },
                            ]}
                            getValueProps={(value) => ({
                                value: value ? dayjs(value, "YYYY-MM-DD") : null,
                            })}
                            getValueFromEvent={(value) => (value ? value.format("YYYY-MM-DD") : null)}
                        >
                            <DatePicker
                                style={{width: "220px"}}
                                format="YYYY-MM-DD"
                                disabledDate={(current) => current && current.isAfter(dayjs().startOf("day"))} // Запрещаем сегодня и будущее
                            />
                        </Form.Item>
                        <Form.Item label="Screenwriter height" name={["screenwriter", "height"]}
                                   rules={[
                                       {required: true, message: "Please input screenwriter height!"},
                                       {
                                           validator: (_, value) => {
                                               if (value && !isValidDouble(value)) {
                                                   return Promise.reject("Expected a numeric value between -2,147,483,648 and 2,147,483,647. Maximum 5 decimal places allowed!");
                                               }
                                               return Promise.resolve();
                                           },
                                       },
                                   ]}>
                            <Input placeholder="Input screenwriter height" style={{width: "220px"}}/>
                        </Form.Item>
                        <Form.Item label="Screenwriter hair color" name={["screenwriter", "hairColor"]}>
                            <Select style={{width: "220px"}}>
                                <Select.Option value="">-- Select an option --</Select.Option>
                                {enumOptions["screenwriter.hairColor"].map((hairColor) => (
                                    <Select.Option key={hairColor} value={hairColor}>
                                        {hairColor}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Screenwriter nationality" name={["screenwriter", "nationality"]}>
                            <Select style={{width: "220px"}}>
                                <Select.Option value="">-- Select an option --</Select.Option>
                                {enumOptions["screenwriter.nationality"].map((nationality) => (
                                    <Select.Option key={nationality} value={nationality}>
                                        {nationality}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Duration" name="duration"
                                   rules={[
                                       {required: true, message: "Please input duration!"},
                                       {
                                           validator: (_, value) => {
                                               if (value && (!isValidInteger(value) || value <= 0)) {
                                                   return Promise.reject("Expected an integer number between 1 and 2,147,483,647!");
                                               }
                                               return Promise.resolve();
                                           },
                                       },
                                   ]}>
                            <Input placeholder="Input duration" style={{width: "220px"}}/>
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            <AppContainer style={{
                width: '100%',
                overflowX: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
            }}>
                <Table
                    dataSource={movies}
                    columns={columns}
                    scroll={{ x: 1200 }}
                    rowKey="id"
                    loading={loading}
                    bordered={true}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                    })}
                    pagination={{
                        total: totalCount,
                        pageSize: pageSize,
                        current: currentPage,
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "10", "20", "50"],
                        onShowSizeChange: handlePageSizeChange,
                        onChange: handlePageChange,
                        showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} фильмов`,
                    }}
                />
                {/*<Table*/}
                {/*    dataSource={movies}*/}
                {/*    columns={columns}*/}
                {/*    scroll={{x: 1200}}*/}
                {/*    rowKey="id"*/}
                {/*    loading={loading}*/}
                {/*    bordered={true}*/}
                {/*    onRow={(record) => ({*/}
                {/*        onClick: () => handleRowClick(record),*/}
                {/*    })}*/}
                {/*    pagination={{*/}
                {/*        total: totalCount,*/}
                {/*        // total: movies.length,*/}
                {/*        pageSize: pageSize,*/}
                {/*        current: currentPage,*/}
                {/*        onChange: (page) => {*/}
                {/*            setCurrentPage(page);*/}
                {/*            // sendXmlRequest();*/}
                {/*        },*/}
                {/*        showTotal: (total, range) =>*/}
                {/*            `${range[0]}-${range[1]} of ${total} items, page size: ${pageSize}`*/}
                {/*        // showTotal: (total, range) => range[0] === pageSize * (currentPage - 1) + movies.length*/}
                {/*        //     ? `${range[0]} item, page size: ${pageSize}`*/}
                {/*        //     : `${range[0]}-${pageSize * (currentPage - 1) + movies.length} items, page size: ${pageSize}`*/}
                {/*    }}*/}
                {/*/>*/}
                {/*<div className="page__size">*/}
                {/*    <div className="select__box select__pagination">*/}
                {/*        <p>Page Size: </p>*/}
                {/*        <AutoComplete*/}
                {/*            options={options}*/}
                {/*            style={{width: 150}}*/}
                {/*            placeholder="Select or enter"*/}
                {/*            onChange={handlePageSizeChange}*/}
                {/*            // filterOption={(inputValue, option) =>*/}
                {/*            //     option?.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== 0*/}
                {/*            // }*/}
                {/*            filterOption={(inputValue, option) =>*/}
                {/*                option?.value.toLowerCase().includes(inputValue.toLowerCase())*/}
                {/*            }*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="wrapper sort">
                    <Sort sortUpdate={setSortString}
                          sortChange={setSortChangeValue}>
                        <Select.Option value="id">ID</Select.Option>
                        <Select.Option value="name">Name</Select.Option>
                        <Select.Option value="coordinates.x">X</Select.Option>
                        <Select.Option value="coordinates.y">Y</Select.Option>
                        <Select.Option value="creationDate">Creation date</Select.Option>
                        <Select.Option value="oscarsCount">Oscars count</Select.Option>
                        <Select.Option value="genre">Genre</Select.Option>
                        <Select.Option value="mpaaRating">Mpaa rating</Select.Option>
                        <Select.Option value="screenwriter.name">Screenwriter name</Select.Option>
                        <Select.Option value="screenwriter.birthday">Screenwriter birthday</Select.Option>
                        <Select.Option value="screenwriter.height">Screenwriter height</Select.Option>
                        <Select.Option value="screenwriter.hairColor">Screenwriter hair color</Select.Option>
                        <Select.Option value="screenwriter.nationality">Screenwriter nationality</Select.Option>
                        <Select.Option value="duration">Duration</Select.Option>
                    </Sort>
                </div>

                <div className="wrapper filter">
                    <Filter filtersUpdate={setFilterString}
                            filterChange={setFilterChangeValue}
                            filterChangeState={filterChange}
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
                        <Select.Option value="creationDate">Creation date</Select.Option>
                        <Select.Option value="oscarsCount">Oscars count</Select.Option>
                        <Select.Option value="genre">Genre</Select.Option>
                        <Select.Option value="mpaaRating">Mpaa rating</Select.Option>
                        <Select.Option value="screenwriter.name">Screenwriter name</Select.Option>
                        <Select.Option value="screenwriter.birthday">Screenwriter birthday</Select.Option>
                        <Select.Option value="screenwriter.height">Screenwriter height</Select.Option>
                        <Select.Option value="screenwriter.hairColor">Screenwriter hair color</Select.Option>
                        <Select.Option value="screenwriter.nationality">Screenwriter nationality</Select.Option>
                        <Select.Option value="duration">Duration</Select.Option>
                    </Filter>
                </div>

                <Button
                    type="primary"
                    onClick={() => {
                        console.log("Нажата кнопка Save filters and sorts");
                        sendXmlRequest();
                    }}
                    loading={loading}
                    style={{marginTop: "10px"}}
                >
                    Search
                </Button>
            </AppContainer>
            <Footer/>
        </AppBody>
    );

}

export default Movie;