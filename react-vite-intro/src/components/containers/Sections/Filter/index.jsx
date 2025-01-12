import React, {useEffect, useState} from "react";
import {DatePicker, Input, message, Select} from "antd";
import dayjs from "dayjs";
import "./index.scoped.css";
import PrimaryButton from "../../../../components/PrimaryButton";
import AddIcon from "../../../../assets/icons/add.svg";
import RemoveIcon from "../../../../assets/icons/remove.svg";

const Filter = (props) => {
    const [filters, setFilters] = useState([{criteria: "id", operator: "EQ", value: ""}]);
    const [loading, setLoading] = useState(false);
    const [enumOptions, setEnumOptions] = useState({});

    useEffect(() => {
        const fetchEnums = async () => {
            setLoading(true);
            try {
                const responses = await Promise.all([
                    fetch("http://localhost:8080/api/v1/movies/colors").then((res) => res.text()),
                    fetch("http://localhost:8080/api/v1/movies/countries").then((res) => res.text()),
                    fetch("http://localhost:8080/api/v1/movies/genres").then((res) => res.text()),
                    fetch("http://localhost:8080/api/v1/movies/ratings").then((res) => res.text()),
                ]);

                console.log(responses);

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
                console.log(enumOptions);


                message.success("Все данные успешно загружены!");
            } catch (error) {
                message.error(`Ошибка загрузки данных: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        const createFilterXML = () => {
            const xmlDocument = document.implementation.createDocument("", "", null);

            const root = xmlDocument.createElement("filters");

            for (const element of filters) {
                const sortingElement = xmlDocument.createElement("filter");

                const fieldElement = xmlDocument.createElement("field");
                fieldElement.textContent = element.criteria;

                const filterTypeElement = xmlDocument.createElement("filterType");
                filterTypeElement.textContent = element.operator;

                const valueElement = xmlDocument.createElement("value");
                valueElement.textContent = element.value;

                sortingElement.appendChild(fieldElement);
                sortingElement.appendChild(filterTypeElement);
                sortingElement.appendChild(valueElement);

                root.appendChild(sortingElement);
            }

            xmlDocument.appendChild(root);

            return new XMLSerializer().serializeToString(xmlDocument);
        };

        const xmlString = createFilterXML();
        props.filtersUpdate(xmlString);

        fetchEnums();
    }, [filters, props]);

    const parseEnumResponse = (xml, tag) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "application/xml");
        return Array.from(xmlDoc.getElementsByTagName(tag)).map((node) => node.textContent);
    };

    const criteriaOptions = [
        {value: "id", type: "number"},
        {value: "name", type: "string"},
        {value: "coordinates.x", type: "number"},
        {value: "coordinates.y", type: "number"},
        {value: "oscarsCount", type: "number"},
        {value: "genre", type: "enum"},
        {value: "mpaaRating", type: "enum"},
        {value: "screenwriter.name", type: "string"},
        {value: "screenwriter.birthday", type: "date"},
        {value: "screenwriter.height", type: "number"},
        {value: "screenwriter.hairColor", type: "enum"},
        {value: "screenwriter.nationality", type: "enum"},
        {value: "duration", type: "number"},
        {value: "creationDate", type: "date"},
    ];

    const operatorOptions = {
        number: ["EQ", "NE", "GT", "GTE", "LT", "LTE"],
        string: ["EQ", "NE", "SUBSTR", "NSUBSTR"],
        date: ["EQ", "NE", "GT", "GTE", "LT", "LTE"],
        enum: ["EQ", "NE"],
    };

    const getOperatorOptions = (type) => {
        return operatorOptions[type]?.map((op) => (
            <Select.Option key={op} value={op}>
                {op}
            </Select.Option>
        ));
    };

    const handleAddFilter = () => {
        setFilters([...filters, {criteria: "id", operator: "EQ", value: ""}]);
    };

    const handleRemoveFilter = (index) => {
        setFilters(filters.filter((_, i) => i !== index));
    };

    const handleFilterChange = (index, value) => {
        const newFilters = [...filters];
        const type = criteriaOptions.find((option) => option.value === newFilters[index].criteria)?.type;

        if (type === "date" && value && !dayjs(value).isValid()) {
            console.error("Invalid date value:", value);
            return;
        }

        newFilters[index].value = value;
        setFilters(newFilters);
    };

    const handleFilterCriteriaChange = (index, value) => {
        const newFilters = [...filters];
        newFilters[index].criteria = value;
        newFilters[index].operator = "EQ";
        newFilters[index].value = "";
        setFilters(newFilters);
    };

    const handleFilterOperatorChange = (index, value) => {
        const newFilters = [...filters];
        newFilters[index].operator = value;
        setFilters(newFilters);
    };

    return (
        <div className="filter__container">
            <div className="filter__criteria">
                <h1>Filtering</h1>
            </div>
            {filters.map((filter, index) => {
                const criteriaType =
                    criteriaOptions.find((option) => option.value === filter.criteria)?.type || "string";

                return (
                    <div className="filter__criteria" key={index}>
                        <div className="select__box">
                            <Select
                                style={{width: 200}}
                                value={filter.criteria}
                                onChange={(value) => handleFilterCriteriaChange(index, value)}
                            >
                                {criteriaOptions.map((option) => (
                                    <Select.Option key={option.value} value={option.value}>
                                        {option.value}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                        <div className="select__box">
                            <Select
                                style={{width: 150}}
                                value={filter.operator}
                                onChange={(value) => handleFilterOperatorChange(index, value)}
                            >
                                {getOperatorOptions(criteriaType)}
                            </Select>
                        </div>
                        <div className="select__box">
                            {criteriaType === "date" ? (
                                <DatePicker
                                    value={filter.value && dayjs(filter.value).isValid() ? dayjs(filter.value) : null}
                                    onChange={(date) => handleFilterChange(index, date ? dayjs(date).toISOString() : "")}
                                    style={{width: "100%"}}
                                    format="YYYY-MM-DD"
                                />
                            ) : criteriaType === "enum" ? (
                                <Select
                                    style={{width: 200}}
                                    value={filter.value}
                                    onChange={(value) => handleFilterChange(index, value)}
                                >
                                    {(enumOptions[filter.criteria] || []).map((option) => (
                                        <Select.Option key={option} value={option}>
                                            {option}
                                        </Select.Option>
                                    ))}
                                </Select>
                            ) : (
                                <Input
                                    type="text"
                                    value={filter.value}
                                    onChange={(e) => handleFilterChange(index, e.target.value)}
                                    placeholder="Input value"
                                />
                            )}
                        </div>
                        <PrimaryButton
                            content="Remove"
                            class="default__button"
                            click={() => handleRemoveFilter(index)}
                            height="21px"
                        >
                            <div>
                                <img src={RemoveIcon} alt="Remove"/>
                            </div>
                        </PrimaryButton>
                    </div>
                );
            })}
            <div className="filter__criteria last">
                <PrimaryButton content="Add" class="default__button" click={handleAddFilter} height="30px">
                    <div>
                        <img src={AddIcon} alt="Add"/>
                    </div>
                </PrimaryButton>
            </div>
        </div>
    );
};

export default Filter;
