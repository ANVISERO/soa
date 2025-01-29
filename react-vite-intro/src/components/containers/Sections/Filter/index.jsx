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
    const [loadedEnums, setLoadedEnums] = useState(false);

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
                        "screenwriter.hairColor": colors,
                        "screenwriter.nationality": countries,
                        genre: genres,
                        mpaaRating: ratings,
                    });

                    message.success("Все данные успешно загружены!");
                    setLoadedEnums(true);  // Устанавливаем флаг о том, что данные загружены
                } catch (error) {
                    message.error(`Ошибка загрузки данных: ${error.message}`);
                } finally {
                    setLoading(false);
                }
            };

            fetchEnums();
        }
    }, [loadedEnums]);

    useEffect(() => {
        props.filtersUpdate(filters);
    }, [filters]);

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
        {value: "creationDate", type: "dateTime"},
    ];

    const operatorOptions = {
        number: ["EQ", "NE", "GT", "GTE", "LT", "LTE"],
        string: ["EQ", "NE", "SUBSTR", "NSUBSTR"],
        date: ["EQ", "NE", "GT", "GTE", "LT", "LTE"],
        dateTime: ["EQ", "NE", "GT", "GTE", "LT", "LTE"],
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
        const type = criteriaOptions.find((option) => option.value === value)?.type;

        newFilters[index].criteria = value;
        newFilters[index].operator = "EQ";
        newFilters[index].value = type === "enum" ? (enumOptions[value]?.[0] || "") : "";

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
                            {criteriaType === "date" || criteriaType === "dateTime" ? (
                                <DatePicker
                                    value={
                                        filter.value &&
                                        dayjs(
                                            filter.value,
                                            criteriaType === "dateTime" ? "YYYY-MM-DDTHH:mm:ss" : "YYYY-MM-DD"
                                        ).isValid()
                                            ? dayjs(
                                                filter.value,
                                                criteriaType === "dateTime" ? "YYYY-MM-DDTHH:mm:ss" : "YYYY-MM-DD"
                                            )
                                            : null
                                    }
                                    onChange={(date) =>
                                        handleFilterChange(
                                            index,
                                            date
                                                ? dayjs(date).format(
                                                    criteriaType === "dateTime" ? "YYYY-MM-DDTHH:mm:ss" : "YYYY-MM-DD"
                                                )
                                                : ""
                                        )
                                    }
                                    style={{width: 200}}
                                    format={criteriaType === "dateTime" ? "YYYY-MM-DDTHH:mm:ss" : "YYYY-MM-DD"}
                                    showTime={
                                        criteriaType === "dateTime"
                                            ? {format: "HH:mm:ss", defaultValue: dayjs("00:00:00", "HH:mm:ss")}
                                            : false
                                    }
                                />
                            ) : criteriaType === "enum" ? (
                                <Select
                                    style={{width: 200}}
                                    value={filter.value || (enumOptions[filter.criteria]?.[0] || "")}
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
                                    style={{ borderColor: props.emptyFields.includes(filter.criteria) ? "red" : undefined }}
                                    onFocus={() => {
                                        props.setEmptyFields((prev) => prev.filter((item) => item !== filter.criteria));
                                    }}
                                    type="text"
                                    value={filter.value}
                                    onChange={(e) => handleFilterChange(index, e.target.value)}
                                    placeholder="Input value"
                                    className="custom-input"
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
