import React, {useEffect, useState} from 'react';

import AppBody from "../../components/containers/AppBody/index.jsx";
import Footer from "../../components/containers/Sections/Footer/index.jsx";
import Header from "../../components/containers/Sections/Header/index.jsx";
import AppContainer from "../../components/containers/AppContainer/index.jsx";
import {Button, notification, Table} from "antd";

function parseSearchResponse(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");

    const movies = Array.from(xmlDoc.getElementsByTagName("MovieResponse")).map(movieNode => {
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

function MovieMax() {

    const [blockedScroll, setBlockedScroll] = useState(1);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMounted, setMounted] = useState(false);
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

    useEffect(() => {
        sendInitialXmlRequest();
        setMounted(true);
    }, []);

    function addToScroll() {
        setBlockedScroll(blockedScroll + 1);
    }

    function removeToScroll() {
        setBlockedScroll(blockedScroll - 1);
    }

    const sendInitialXmlRequest = async () => {
        setLoading(true);

        try {
            const response = await fetch("https://localhost:8765/movie/api/v1/movies/screenwriter/max", {
                method: "GET",
                headers: {
                    "Content-Type": "application/xml",
                }
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
            const movies = parseSearchResponse(responseText);

            setMovies(movies);

            notification.success({
                message: "Data uploaded successfully",
                // description: 'Фильм был успешно удалён из базы данных.',
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

    return (
        <AppBody style={{margin: 0, padding: 0}}>
            <Header logo="home" addToScroll={addToScroll} removeToScroll={removeToScroll} tasks={false}>
            </Header>
            <AppContainer>
                <div style={{
                    width: '100%',
                    overflowX: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '10px'
                }}>
                    <AppContainer style={{
                        width: '100%',
                        overflowX: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        alignSelf: 'flex-start'
                    }}>
                        <Table
                            dataSource={movies}
                            columns={columns}
                            scroll={{x: 1200}}
                            rowKey="id"
                            loading={loading}
                            bordered={true}
                            pagination={false}
                        />

                        <Button
                            type="primary"
                            onClick={() => {
                                sendInitialXmlRequest();
                            }}
                            loading={loading}
                            style={{marginTop: "10px"}}
                        >
                            Update rate
                        </Button>
                    </AppContainer>
                </div>
            </AppContainer>
            <Footer/>
        </AppBody>
    );

}

export default MovieMax;