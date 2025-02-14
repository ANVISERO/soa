import React, {useEffect, useState} from "react";
import {DatePicker, Input, message, Select} from "antd";
import dayjs from "dayjs";
import "./index.scoped.css";
import PrimaryButton from "../../../../components/PrimaryButton";
import AddIcon from "../../../../assets/icons/add.svg";
import RemoveIcon from "../../../../assets/icons/remove.svg";
import {v4 as uuidv4} from "uuid";

const Filter = (props) => {
    const [filters, setFilters] = useState([]);
    const [filterChange, setFilterChange] = useState(false);

    useEffect(() => {
        console.log("filterChange " + filterChange);
        props.filtersUpdate(filters);
        props.filterChange(filterChange);
    }, [filters]);

    useEffect(() => {
        props.filterChange(props.filterChangeState);
    }, [props.filterChangeState]);

    const criteriaOptions = [
        {value: "id", type: "number", name: "ID"},
        {value: "name", type: "string", name: "Name"},
        {value: "coordinates.x", type: "number", name: "X"},
        {value: "coordinates.y", type: "number", name: "Y"},
        {value: "creationDate", type: "dateTime", name: "Creation date"},
        {value: "oscarsCount", type: "number", name: "Oscars count"},
        {value: "genre", type: "enum", name: "Genre"},
        {value: "mpaaRating", type: "enum", name: "Mpaa rating"},
        {value: "screenwriter.name", type: "string", name: "Screenwriter name"},
        {value: "screenwriter.birthday", type: "date", name: "Screenwriter birthday"},
        {value: "screenwriter.height", type: "number", name: "Screenwriter height"},
        {value: "screenwriter.hairColor", type: "enum", name: "Screenwriter hair color"},
        {value: "screenwriter.nationality", type: "enum", name: "Screenwriter nationality"},
        {value: "duration", type: "number", name: "Duration"},
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
        setFilterChange(true);
        setFilters([...filters, {id: uuidv4(), criteria: "id", operator: "EQ", value: ""}]);
    };

    const handleRemoveFilter = (id) => {
        setFilterChange(true);
        setFilters(filters.filter((filter) => filter.id !== id));
        props.setErrorMessages((prev) => {
            const newErrors = {...prev};
            delete newErrors[id];
            return newErrors;
        });
        props.setEmptyFields((prev) => prev.filter((item) => item !== id));
    };

    const handleFilterChange = (id, value) => {
        setFilterChange(true);
        setFilters((prevFilters) =>
            prevFilters.map((filter) =>
                filter.id === id ? {...filter, value} : filter
            )
        );
    };

    const handleFilterCriteriaChange = (id, value) => {
        setFilterChange(true);
        const newFilters = [...filters];
        const filterIndex = newFilters.findIndex((filter) => filter.id === id);
        if (filterIndex === -1) return;

        const type = criteriaOptions.find((option) => option.value === value)?.type;

        newFilters[filterIndex].criteria = value;
        newFilters[filterIndex].operator = "EQ";
        newFilters[filterIndex].value = type === "enum" ? (props.enumOptions[value]?.[0] || "") : "";

        setFilters(newFilters);
    };

    const handleFilterOperatorChange = (id, value) => {
        setFilterChange(true);
        const newFilters = [...filters];
        const filterIndex = newFilters.findIndex((filter) => filter.id === id);
        if (filterIndex === -1) return;

        newFilters[filterIndex].operator = value;
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
                    <div className="filter__criteria" key={filter.id}>
                        <div className="select__box">
                            <Select
                                style={{width: 200}}
                                value={filter.criteria}
                                onChange={(value) => handleFilterCriteriaChange(filter.id, value)}
                            >
                                {criteriaOptions.map((option) => (
                                    <Select.Option key={option.value} value={option.value}>
                                        {option.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                        <div className="select__box">
                            <Select
                                style={{width: 150}}
                                value={filter.operator}
                                onChange={(value) => handleFilterOperatorChange(filter.id, value)}
                            >
                                {getOperatorOptions(criteriaType)}
                            </Select>
                        </div>
                        <div className="select__box">
                            {criteriaType === "date" || criteriaType === "dateTime" ? (
                                <div className="custom-input-container">
                                    <DatePicker
                                        className={`date-input ${
                                            props.errorMessages[filter.id] ? "error" : ""
                                        }`}
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
                                        onChange={(date) => {
                                            handleFilterChange(
                                                filter.id,
                                                date
                                                    ? dayjs(date).format(
                                                        criteriaType === "dateTime" ? "YYYY-MM-DDTHH:mm:ss" : "YYYY-MM-DD"
                                                    )
                                                    : ""
                                            );
                                            props.setErrorMessages((prev) => ({...prev, [filter.id]: undefined}));
                                        }
                                        }
                                        style={{width: 220}}
                                        format={criteriaType === "dateTime" ? "YYYY-MM-DDTHH:mm:ss" : "YYYY-MM-DD"}
                                        showTime={
                                            criteriaType === "dateTime"
                                                ? {format: "HH:mm:ss", defaultValue: dayjs("00:00:00", "HH:mm:ss")}
                                                : false
                                        }
                                    />
                                    {(props.errorMessages[filter.id]) && (
                                        <div className="error-message">
                                            {props.errorMessages[filter.id] ? props.errorMessages[filter.id] : "Field cannot be empty"}
                                        </div>
                                    )}
                                </div>
                            ) : criteriaType === "enum" ? (
                                <Select
                                    style={{width: 220}}
                                    value={filter.value || (props.enumOptions[filter.criteria]?.[0] || "")}
                                    onChange={(value) => handleFilterChange(filter.id, value)}
                                >
                                    {(props.enumOptions[filter.criteria] || []).map((option) => (
                                        <Select.Option key={option} value={option}>
                                            {option}
                                        </Select.Option>
                                    ))}
                                </Select>
                            ) : (
                                <div className="custom-input-container">
                                    <Input
                                        className={`custom-input ${
                                            props.errorMessages[filter.id] ? "error" : ""
                                        }`}
                                        type="text"
                                        value={filter.value}
                                        onChange={(e) => {
                                            handleFilterChange(filter.id, e.target.value);
                                            props.setErrorMessages((prev) => ({...prev, [filter.id]: undefined}));
                                        }}
                                        placeholder="Input value"
                                    />
                                    {(props.errorMessages[filter.id]) && (
                                        <div className="error-message">
                                            {props.errorMessages[filter.id] ? props.errorMessages[filter.id] : "Field cannot be empty"}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <PrimaryButton
                            content="Remove"
                            class="default__button"
                            click={() => handleRemoveFilter(filter.id)}
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
