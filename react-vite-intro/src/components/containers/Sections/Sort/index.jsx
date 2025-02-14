import React, { useState, useEffect } from "react";
import "./index.scoped.css";
import PrimaryButton from "./../../../../components/PrimaryButton";
import AddIcon from "../../../../assets/icons/add.svg";
import RemoveIcon from "../../../../assets/icons/remove.svg";
import { Select } from "antd";

function Sort(props) {
    const [sort, setSort] = useState([]);
    const [sortChange, setSortChange] = useState(false);


    useEffect(() => {
        props.sortChange(sortChange);
        const createSortingXML = () => {
            const xmlDocument = document.implementation.createDocument("", "", null);

            const root = xmlDocument.createElement("sortings");

            for (const element of sort) {
                const sortingElement = xmlDocument.createElement("sorting");

                const fieldElement = xmlDocument.createElement("field");
                fieldElement.textContent = element.value;

                const typeElement = xmlDocument.createElement("type");
                typeElement.textContent = element.order;

                sortingElement.appendChild(fieldElement);
                sortingElement.appendChild(typeElement);

                root.appendChild(sortingElement);
            }

            xmlDocument.appendChild(root);

            return new XMLSerializer().serializeToString(xmlDocument);
        };

        const xmlString = createSortingXML();
        props.sortUpdate(xmlString);
    }, [sort, props]);

    function handleAddSortCriteria() {
        setSortChange(true)
        setSort([...sort, { value: "id", order: "asc" }]);
    }

    function handleRemoveSortCriteria(index) {
        setSortChange(true)
        setSort(sort.filter((_, i) => i !== index));
    }

    function handleSortCriteriaChange(index, value) {
        setSortChange(true)
        setSort(
            sort.map((criteria, i) =>
                i === index ? { ...criteria, value } : criteria
            )
        );
    }

    function handleOrderChange(index, order) {
        setSortChange(true)
        setSort(
            sort.map((criteria, i) =>
                i === index ? { ...criteria, order } : criteria
            )
        );
    }

    return (
        <div className="sort__container">
            <div className="sort__criteria">
                <h1>Sorting</h1>
            </div>
            {sort.map((criteria, index) => (
                <div className="sort__criteria" key={index}>
                    <div className="select__box">
                        <Select
                            style={{ width: 200 }}
                            value={criteria.value}
                            onChange={(value) => handleSortCriteriaChange(index, value)}
                        >
                            {props.children}
                        </Select>
                    </div>
                    <div className="select__box">
                        <Select
                            style={{ width: 130 }}
                            value={criteria.order}
                            onChange={(value) => handleOrderChange(index, value)}
                        >
                            <Select.Option value="asc">Ascending</Select.Option>
                            <Select.Option value="desc">Descending</Select.Option>
                        </Select>
                    </div>
                    <PrimaryButton
                        content="Remove"
                        class="default__button"
                        click={() => handleRemoveSortCriteria(index)}
                        height="21px"
                    >
                        <div>
                            <img src={RemoveIcon} alt="Remove" />
                        </div>
                    </PrimaryButton>
                </div>
            ))}
            <div className="sort__criteria last">
                <PrimaryButton
                    content="Add"
                    class="default__button"
                    click={handleAddSortCriteria}
                    height="30px"
                >
                    <div>
                        <img src={AddIcon} alt="Add" />
                    </div>
                </PrimaryButton>
            </div>
        </div>
    );
}

export default Sort;
