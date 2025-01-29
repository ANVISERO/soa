import React, {useEffect, useState} from 'react';

import AppBody from "../../components/containers/AppBody/index.jsx";
import Footer from "../../components/containers/Sections/Footer/index.jsx";
import Header from "../../components/containers/Sections/Header/index.jsx";
import AppContainer from "../../components/containers/AppContainer/index.jsx";
import {AutoComplete, Button, message, Select, Table} from "antd";
import Sort from "../../components/containers/Sections/Sort/index.jsx";
import Filter from "../../components/containers/Sections/Filter/index.jsx";

function formatDateTimeString(dateString) {
    if (!dateString) return null;

    const [datePart, timePart] = dateString.split('T');
    if (!datePart || !timePart) return dateString;

    const [year, month, day] = datePart.split('-');
    return `${day}-${month}-${year} ${timePart}`;
}

function formatDateString(dateString) {
    if (!dateString) return null;


    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

function parseSearchResponse(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");

    const movies = Array.from(xmlDoc.getElementsByTagName("movie")).map(movieNode => {
        const id = parseInt(movieNode.getElementsByTagName("id")[0].textContent);
        const name = movieNode.getElementsByTagName("name")[0].textContent;
        const x = parseFloat(movieNode.getElementsByTagName("x")[0].textContent);
        const y = parseFloat(movieNode.getElementsByTagName("y")[0].textContent);
        const coordinates = {x, y};

        const creationDate = formatDateTimeString(movieNode.getElementsByTagName("creationDate")[0]?.textContent || null);

        const oscarsCount = parseInt(movieNode.getElementsByTagName("oscarsCount")[0].textContent);
        const genre = movieNode.getElementsByTagName("genre")[0].textContent;
        const mpaaRating = movieNode.getElementsByTagName("mpaaRating")[0].textContent;

        const screenwriterNode = movieNode.getElementsByTagName("screenwriter")[0];
        const screenwriter = {
            name: screenwriterNode.getElementsByTagName("name")[0].textContent,
            birthday: formatDateString(screenwriterNode.getElementsByTagName("birthday")[0].textContent),
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
    // const [filterParams, setFilterParams] = useState("");
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
                style: {minWidth: 120, maxWidth: 120},
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
            const { movies, totalPages } = parseSearchResponse(responseText);

            setMovies(movies);
            setTotalCount(totalPages * pageSize);
            setTotalPages(totalPages);

            message.success("Данные успешно получены!");
        } catch (error) {
            message.error(`Ошибка запроса: ${error.message}`);
        } finally {
            setLoading(false);
            setInitialLoad(false); // Обновляем состояние после успешного завершения
        }
    };

    const sendXmlRequest = async () => {
        // if (filters.some(element => !element.value || element.value.trim() === "")) {
        //     const emptyFields = filters.filter(element => !element.value || element.value.trim() === "");
        //     const fieldNames = emptyFields.map(element => `"${element.criteria}"`).join(", ");
        //     message.error(`Пожалуйста, заполните поля: ${fieldNames}`);
        //     return;
        // }
        // Определяем пустые фильтры
        const emptyFields = filters.filter(element => !element.value || element.value.trim() === "");
        const emptyFieldNames = emptyFields.map(element => element.criteria);

        // Если есть пустые поля, сохраняем их в `emptyFilters` и выводим ошибку
        if (emptyFields.length > 0) {
            setEmptyFilters(emptyFieldNames);
            message.error(`Пожалуйста, заполните поля: ${emptyFieldNames.join(", ")}`);
            return;
        }

        // Если ошибок нет, сбрасываем `emptyFilters`
        setEmptyFilters([]);

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
            const { movies, totalPages } = parseSearchResponse(responseText);

            setMovies(movies);
            setTotalCount(totalPages * pageSize);
            setTotalPages(totalPages);

            message.success("Данные успешно получены!");
        } catch (error) {
            message.error(`Ошибка запроса: ${error.message}`);
        } finally {
            setLoading(false);
            setInitialLoad(false); // Обновляем состояние после успешного завершения
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

    // function setFilterString(params) {
    //     setFilterParams(params.slice());
    // }
    function setFilterString(params) {
        setFilters(params.slice());
    }

    return (
        <AppBody style={{margin: 0, padding: 0}}>
            <Header logo="home" addToScroll={addToScroll} removeToScroll={removeToScroll} tasks={false}>
            </Header>
            <AppContainer style={{width: '100%', overflowX: 'auto'}}>
                <Table
                    dataSource={movies}
                    columns={columns}
                    scroll={{x: 1200}}
                    rowKey="id"
                    loading={loading}
                    bordered={true}
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
                    <Filter filtersUpdate={setFilterString} emptyFields={emptyFilters} setEmptyFields={setEmptyFilters} >
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
                        <Select.Option value="screenwriter.hairColor">Screenwriter hair color</Select.Option>
                        <Select.Option value="screenwriter.nationality">Screenwriter nationality</Select.Option>
                        <Select.Option value="screenwriter.price">Screenwriter price</Select.Option>
                        <Select.Option value="duration">Duration</Select.Option>
                    </Filter>
                </div>

                <Button type="primary" onClick={sendXmlRequest} loading={loading} style={{marginTop: "10px"}}>
                    Сохранить параметры фильтрации и сортировки
                </Button>
            </AppContainer>
            <Footer/>
        </AppBody>
    );

}

export default Movie;