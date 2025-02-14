import React, {useEffect, useState} from 'react';

import AppBody from "../../components/containers/AppBody/index.jsx";
import Footer from "../../components/containers/Sections/Footer/index.jsx";
import Header from "../../components/containers/Sections/Header/index.jsx";
import AppContainer from "../../components/containers/AppContainer/index.jsx";
import {Button, notification, Table} from "antd";

function parseSearchResponse(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");

    const person = Array.from(xmlDoc.getElementsByTagName("pearson")).map(personNode => {
        const name = personNode.getElementsByTagName("name")[0].textContent;
        const birthday = personNode.getElementsByTagName("birthday")[0].textContent;
        const height = parseFloat(personNode.getElementsByTagName("height")[0].textContent);
        const hairColor = personNode.getElementsByTagName("hairColor")[0].textContent;
        const nationality = personNode.getElementsByTagName("nationality")[0].textContent;

        return {name, birthday, height, hairColor, nationality};
    });

    return person;
}

function Loosers() {

    const [blockedScroll, setBlockedScroll] = useState(1);
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMounted, setMounted] = useState(false);
    const personsColumns = [
        {
            title: "Screenwriter",
            children: [
                {
                    title: "Name",
                    dataIndex: ["name"],
                    key: "screenwriter.name",
                    width: 80,
                    align: "center",
                    onCell: () => ({
                        style: {minWidth: 80, maxWidth: 150},
                    }),
                },
                {
                    title: "Birthday",
                    dataIndex: ["birthday"],
                    key: "screenwriter.birthday",
                    width: 120,
                    align: "center",
                    onCell: () => ({
                        style: {minWidth: 120, maxWidth: 120},
                    }),
                },
                {
                    title: "Height",
                    dataIndex: ["height"],
                    key: "screenwriter.height",
                    width: 80,
                    align: "center",
                    onCell: () => ({
                        style: {minWidth: 80, maxWidth: 80},
                    }),
                },
                {
                    title: "Hair color",
                    dataIndex: ["hairColor"],
                    key: "screenwriter.hairColor",
                    width: 70,
                    align: "center",
                    onCell: () => ({
                        style: {minWidth: 80, maxWidth: 90},
                    }),
                },
                {
                    title: "Nationality",
                    dataIndex: ["nationality"],
                    key: "screenwriter.nationality",
                    width: 110,
                    align: "center",
                    onCell: () => ({
                        style: {minWidth: 80, maxWidth: 160},
                    }),
                }
            ],
        }
    ];

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
            const response = await fetch("https://localhost:9091/oscar/api/v1/oscar/directors/get-loosers", {
                method: "GET",
                headers: {
                    "Content-Type": "application/xml",
                }
            });

            if (!response.ok) {
                if (response.status === 503) {
                    notification.error({
                        message: "External Service Unavailable",
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
            const persons = parseSearchResponse(responseText);

            if (persons.length === 0) {
                notification.info({
                    message: "Data not found",
                    // description: 'Фильм был успешно удалён из базы данных.',
                    placement: 'topRight',
                });
                return;
            }

            setPersons(persons);

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
                            dataSource={persons}
                            columns={personsColumns}
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

export default Loosers;