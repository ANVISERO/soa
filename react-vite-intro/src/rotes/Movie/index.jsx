import React, {useEffect, useState} from 'react';

import AppBody from "../../components/containers/AppBody/index.jsx";
import Footer from "../../components/containers/Sections/Footer/index.jsx";
import Header from "../../components/containers/Sections/Header/index.jsx";
import AppContainer from "../../components/containers/AppContainer/index.jsx";
import {Button, message, Table} from "antd";

function parseSearchResponse(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");

    const movies = Array.from(xmlDoc.getElementsByTagName("movie")).map(movieNode => {
        const id = parseInt(movieNode.getElementsByTagName("id")[0].textContent);
        const name = movieNode.getElementsByTagName("name")[0].textContent;
        const x = parseFloat(movieNode.getElementsByTagName("x")[0].textContent);
        const y = parseFloat(movieNode.getElementsByTagName("y")[0].textContent);
        const coordinates = {x, y};
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

        return {id, name, coordinates, oscarsCount, genre, mpaaRating, screenwriter, duration};
    });

    const totalPages = parseInt(xmlDoc.getElementsByTagName("totalPages")[0].textContent);

    return {movies, totalPages};
}

function Movie(props) {

    const [blockedScroll, setBlockedScroll] = useState(1);


    function addToScroll() {
        setBlockedScroll(blockedScroll + 1);
    }

    function removeToScroll() {
        setBlockedScroll(blockedScroll - 1);
    }

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Coordinates",
            children: [
                {
                    title: "X",
                    dataIndex: ["coordinates", "x"],
                    key: "coordinates.x",
                },
                {
                    title: "Y",
                    dataIndex: ["coordinates", "y"],
                    key: "coordinates.y",
                },
            ],
        },
        {
            title: "Oscars Count",
            dataIndex: "oscarsCount",
            key: "oscarsCount",
        },
        {
            title: "Genre",
            dataIndex: "genre",
            key: "genre",
        },
        {
            title: "MpaaRating",
            dataIndex: "mpaaRating",
            key: "mpaaRating",
        },
        {
            title: "Screenwriter",
            children: [
                {
                    title: "Name",
                    dataIndex: ["screenwriter", "name"],
                    key: "screenwriter.name",
                },
                {
                    title: "Birthday",
                    dataIndex: ["screenwriter", "birthday"],
                    key: "screenwriter.birthday",
                },
                {
                    title: "Height",
                    dataIndex: ["screenwriter", "height"],
                    key: "screenwriter.height",
                },
                {
                    title: "Hair color",
                    dataIndex: ["screenwriter", "hairColor"],
                    key: "screenwriter.hairColor",
                },
                {
                    title: "Nationality",
                    dataIndex: ["screenwriter", "nationality"],
                    key: "screenwriter.nationality",
                }
            ],
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
        },
    ];

    // const [movies, setMovies] =
    //     useState([
    //     {
    //         id: 1,
    //         name: "Inception",
    //         coordinates: { x: 12.34, y: 56.78 },
    //         oscarsCount: 4,
    //         genre: "Sci-Fi",
    //         mpaaRating: "PG-13",
    //         screenwriter: {
    //             name: "Christopher Nolan",
    //             birthday: "1970-07-30",
    //             height: 180,
    //             hairColor: "Brown",
    //             nationality: "British-American",
    //         },
    //         duration: 148,
    //     },
    //     {
    //         id: 2,
    //         name: "The Godfather",
    //         coordinates: { x: 90.12, y: 45.67 },
    //         oscarsCount: 3,
    //         genre: "Crime",
    //         mpaaRating: "R",
    //         screenwriter: {
    //             name: "Mario Puzo",
    //             birthday: "1920-10-15",
    //             height: 175,
    //             hairColor: "Black",
    //             nationality: "American",
    //         },
    //         duration: 175,
    //     },
    //     {
    //         id: 3,
    //         name: "Inception",
    //         coordinates: { x: 12.34, y: 56.78 },
    //         oscarsCount: 4,
    //         genre: "Sci-Fi",
    //         mpaaRating: "PG-13",
    //         screenwriter: {
    //             name: "Christopher Nolan",
    //             birthday: "1970-07-30",
    //             height: 180,
    //             hairColor: "Brown",
    //             nationality: "British-American",
    //         },
    //         duration: 148,
    //     },
    //     {
    //         id: 4,
    //         name: "The Godfather",
    //         coordinates: { x: 90.12, y: 45.67 },
    //         oscarsCount: 3,
    //         genre: "Crime",
    //         mpaaRating: "R",
    //         screenwriter: {
    //             name: "Mario Puzo",
    //             birthday: "1920-10-15",
    //             height: 175,
    //             hairColor: "Black",
    //             nationality: "American",
    //         },
    //         duration: 175,
    //     },
    //     {
    //         id: 5,
    //         name: "Inception",
    //         coordinates: { x: 12.34, y: 56.78 },
    //         oscarsCount: 4,
    //         genre: "Sci-Fi",
    //         mpaaRating: "PG-13",
    //         screenwriter: {
    //             name: "Christopher Nolan",
    //             birthday: "1970-07-30",
    //             height: 180,
    //             hairColor: "Brown",
    //             nationality: "British-American",
    //         },
    //         duration: 148,
    //     },
    //     {
    //         id: 6,
    //         name: "The Godfather",
    //         coordinates: { x: 90.12, y: 45.67 },
    //         oscarsCount: 3,
    //         genre: "Crime",
    //         mpaaRating: "R",
    //         screenwriter: {
    //             name: "Mario Puzo",
    //             birthday: "1920-10-15",
    //             height: 175,
    //             hairColor: "Black",
    //             nationality: "American",
    //         },
    //         duration: 175,
    //     },
    //     {
    //         id: 7,
    //         name: "Inception",
    //         coordinates: { x: 12.34, y: 56.78 },
    //         oscarsCount: 4,
    //         genre: "Sci-Fi",
    //         mpaaRating: "PG-13",
    //         screenwriter: {
    //             name: "Christopher Nolan",
    //             birthday: "1970-07-30",
    //             height: 180,
    //             hairColor: "Brown",
    //             nationality: "British-American",
    //         },
    //         duration: 148,
    //     },
    //     {
    //         id: 8,
    //         name: "The Godfather",
    //         coordinates: { x: 90.12, y: 45.67 },
    //         oscarsCount: 3,
    //         genre: "Crime",
    //         mpaaRating: "R",
    //         screenwriter: {
    //             name: "Mario Puzo",
    //             birthday: "1920-10-15",
    //             height: 175,
    //             hairColor: "Black",
    //             nationality: "American",
    //         },
    //         duration: 175,
    //     },
    //     {
    //         id: 9,
    //         name: "Inception",
    //         coordinates: { x: 12.34, y: 56.78 },
    //         oscarsCount: 4,
    //         genre: "Sci-Fi",
    //         mpaaRating: "PG-13",
    //         screenwriter: {
    //             name: "Christopher Nolan",
    //             birthday: "1970-07-30",
    //             height: 180,
    //             hairColor: "Brown",
    //             nationality: "British-American",
    //         },
    //         duration: 148,
    //     },
    //     {
    //         id: 10,
    //         name: "The Godfather",
    //         coordinates: { x: 90.12, y: 45.67 },
    //         oscarsCount: 3,
    //         genre: "Crime",
    //         mpaaRating: "R",
    //         screenwriter: {
    //             name: "Mario Puzo",
    //             birthday: "1920-10-15",
    //             height: 175,
    //             hairColor: "Black",
    //             nationality: "American",
    //         },
    //         duration: 175,
    //     },
    //     {
    //         id: 11,
    //         name: "Inception",
    //         coordinates: { x: 12.34, y: 56.78 },
    //         oscarsCount: 4,
    //         genre: "Sci-Fi",
    //         mpaaRating: "PG-13",
    //         screenwriter: {
    //             name: "Christopher Nolan",
    //             birthday: "1970-07-30",
    //             height: 180,
    //             hairColor: "Brown",
    //             nationality: "British-American",
    //         },
    //         duration: 148,
    //     },
    //     {
    //         id: 12,
    //         name: "The Godfather",
    //         coordinates: { x: 90.12, y: 45.67 },
    //         oscarsCount: 3,
    //         genre: "Crime",
    //         mpaaRating: "R",
    //         screenwriter: {
    //             name: "Mario Puzo",
    //             birthday: "1920-10-15",
    //             height: 175,
    //             hairColor: "Black",
    //             nationality: "American",
    //         },
    //         duration: 175,
    //     },
    //     {
    //         id: 13,
    //         name: "Inception",
    //         coordinates: { x: 12.34, y: 56.78 },
    //         oscarsCount: 4,
    //         genre: "Sci-Fi",
    //         mpaaRating: "PG-13",
    //         screenwriter: {
    //             name: "Christopher Nolan",
    //             birthday: "1970-07-30",
    //             height: 180,
    //             hairColor: "Brown",
    //             nationality: "British-American",
    //         },
    //         duration: 148,
    //     },
    //     {
    //         id: 14,
    //         name: "The Godfather",
    //         coordinates: { x: 90.12, y: 45.67 },
    //         oscarsCount: 3,
    //         genre: "Crime",
    //         mpaaRating: "R",
    //         screenwriter: {
    //             name: "Mario Puzo",
    //             birthday: "1920-10-15",
    //             height: 175,
    //             hairColor: "Black",
    //             nationality: "American",
    //         },
    //         duration: 175,
    //     },
    //     {
    //         id: 15,
    //         name: "Inception",
    //         coordinates: { x: 12.34, y: 56.78 },
    //         oscarsCount: 4,
    //         genre: "Sci-Fi",
    //         mpaaRating: "PG-13",
    //         screenwriter: {
    //             name: "Christopher Nolan",
    //             birthday: "1970-07-30",
    //             height: 180,
    //             hairColor: "Brown",
    //             nationality: "British-American",
    //         },
    //         duration: 148,
    //     },
    //     {
    //         id: 16,
    //         name: "The Godfather",
    //         coordinates: { x: 90.12, y: 45.67 },
    //         oscarsCount: 3,
    //         genre: "Crime",
    //         mpaaRating: "R",
    //         screenwriter: {
    //             name: "Mario Puzo",
    //             birthday: "1920-10-15",
    //             height: 175,
    //             hairColor: "Black",
    //             nationality: "American",
    //         },
    //         duration: 175,
    //     }
    // ]);

    const [totalCount, setTotalCount] = useState(0);

    const [movies, setMovies] = useState([]); // Данные для таблицы
    const [xmlInput, setXmlInput] = useState(""); // XML-запрос от пользователя
    const [loading, setLoading] = useState(false); // Индикатор загрузки

    // async function parseMovies(xml) {
    //     const result = await parseStringPromise(xml, { explicitArray: false });
    //     const movies = result.SearchResponse.movies.movie.map((movie) => ({
    //         id: parseInt(movie.id, 10),
    //         name: movie.name,
    //         coordinates: {
    //             x: parseFloat(movie.coordinates.x),
    //             y: parseFloat(movie.coordinates.y),
    //         },
    //         oscarsCount: parseInt(movie.oscarsCount, 10),
    //         genre: movie.genre,
    //         mpaaRating: movie.mpaaRating,
    //         screenwriter: {
    //             name: movie.screenwriter.name,
    //             birthday: movie.screenwriter.birthday,
    //             height: parseFloat(movie.screenwriter.height),
    //             hairColor: movie.screenwriter.hairColor,
    //             nationality: movie.screenwriter.nationality,
    //         },
    //         duration: parseInt(movie.duration, 10),
    //     }));
    //
    //     const totalPages = parseInt(result.SearchResponse.totalPages, 10);
    //
    //     return { movies, totalPages };
    // }

    useEffect(() => {
        const fetchData = async () => {
            // Симуляция загрузки данных
            const fakeXmlResponse = `
                <SearchResponse>
                    <movies>
                        <movie>
                            <id>1</id>
                            <name>Inception</name>
                            <x>34.5</x>
                            <y>-12.7</y>
                            <oscarsCount>4</oscarsCount>
                            <genre>SCI_FI</genre>
                            <mpaaRating>PG_13</mpaaRating>
                            <screenwriter>
                                <name>Christopher Nolan</name>
                                <birthday>1970-07-30</birthday>
                                <height>1.8</height>
                                <hairColor>Brown</hairColor>
                                <nationality>British</nationality>
                            </screenwriter>
                            <duration>148</duration>
                        </movie>
                    </movies>
                    <totalPages>1</totalPages>
                </SearchResponse>
            `;

            const {movies, totalPages} = parseSearchResponse(fakeXmlResponse);
            setMovies(movies);
            setTotalCount(totalPages * props.pageSize); // Рассчитываем общее количество записей
        };

        fetchData();
    }, [props.pageSize]);

    const sendXmlRequest = async () => {
        // if (!xmlInput.trim()) {
        //     message.error("Введите XML-запрос.");
        //     return;
        // }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/v1/movies/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/xml",
                }
                // body: xmlInput, // Отправляемый XML
            });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.statusText}`);
            }

            const responseText = await response.text();

            // Парсинг ответа от сервера
            const {movies, totalPages} = parseSearchResponse(responseText);
            setMovies(movies);
            setTotalCount(totalPages * props.pageSize); // Рассчитываем общее количество записей

            message.success("Данные успешно получены!");
        } catch (error) {
            message.error(`Ошибка запроса: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppBody>
            {/*<Header logo="home" addToScroll={addToScroll} removeToScroll={removeToScroll} tasks={false}>*/}
            {/*</Header>*/}
            <Header logo="home" addToScroll={addToScroll} removeToScroll={removeToScroll} tasks={false}>
            </Header>
            <AppContainer>
                <h2>XML-запрос</h2>
                {/*<Input.TextArea*/}
                {/*    value={xmlInput}*/}
                {/*    onChange={(e) => setXmlInput(e.target.value)}*/}
                {/*    placeholder="Введите XML для отправки на сервер"*/}
                {/*    rows={8}*/}
                {/*/>*/}
                <Button type="primary" onClick={sendXmlRequest} loading={loading} style={{marginTop: "10px"}}>
                    Отправить запрос
                </Button>

                <h2 style={{marginTop: "20px"}}>Результаты</h2>
                <Table
                    dataSource={movies}
                    columns={columns}
                    rowKey="id" // Уникальный ключ строки
                    loading={loading}
                    bordered={true}
                    pagination={{
                        total: totalCount,
                        pageSize: props.pageSize,
                        showTotal: (total, range) => range[0] === range[1]
                            ? `${range[0]} of ${total} items`
                            : `${range[0]}-${range[1]} of ${total} items`
                    }}
                />
            </AppContainer>
            {/*<Header logo="" addToScroll={() => {}} removeToScroll={() => {}} tasks={false} hover="no__hover"></Header>*/}
            <Footer/>
        </AppBody>
    );

}

export default Movie;