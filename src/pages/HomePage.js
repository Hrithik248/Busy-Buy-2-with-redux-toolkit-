import { useEffect, useState } from 'react';
import Spinner from 'react-spinner-material';
import style from '../styles/HomePage.module.css';
import spinnerStyle from '../styles/Spinner.module.css';
import ProductCard from '../components/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { selectProductsList, fetchProducts, selectProductsLoadingState } from '../redux/slices/productsSlice';

export default function HomePage() {
    const dispatch = useDispatch();

    // State for keeping track of price slider in filter
    const [priceRange, setPriceRange] = useState(700000);

    // Searching field for searching products
    const [searchField, setSearchField] = useState('');

    // State for saving selected categories in filter
    const [selectedCategory, setSelectedCategory] = useState([]);

    // State for saving list of products available
    const prodList = useSelector(selectProductsList);

    // State for keeping filtered products according to filter states
    const [searchAndFilterResult, setSearchAndFilterResults] = useState([]);

    // Loading state for showing spinner
    const isLoading = useSelector(selectProductsLoadingState);

    // Fetching product list
    useEffect(() => {
        if (prodList.length === 0) {
            dispatch(fetchProducts());
        }
    }, []);

    // Filtering the product based on search field and filters applied
    useEffect(() => {
        if (prodList.length > 0) {
            let filteredList = prodList;

            // If the search field is not empty, then filter the products according to that
            if (searchField !== '') {
                filteredList = searchAndFilterResult.filter((prod) => {
                    return prod.name.toLowerCase().includes(searchField.toLowerCase());
                });
            }

            // If some category is selected from the filter
            if (selectedCategory.length !== 0) {
                filteredList = filteredList.filter((prod) => selectedCategory.includes(prod.category));
            }

            // Filter based on the price slider
            filteredList = filteredList.filter((prod) => prod.price <= priceRange);

            setSearchAndFilterResults(filteredList);
        }
    }, [prodList, searchField, priceRange, selectedCategory]);

    // Setting selected category array state on selecting any category checkbox
    function handleCheckCategory(category) {
        const index = selectedCategory.findIndex((cat) => cat === category);
        const newSelectedCategory = [...selectedCategory];

        if (index === -1) {
            newSelectedCategory.push(category);
        } else {
            newSelectedCategory.splice(index, 1);
        }

        setSelectedCategory(newSelectedCategory);
    }

    return (
        isLoading ? <Spinner radius={200} stroke={5} className={spinnerStyle.spinner} color={'#2874f0'} visible={isLoading} /> :
            <div className={style.homeCon}>
                <div className={style.filterCon}>
                    <div className={style.filter}>
                        <h3>Filter</h3>
                        <p>Price: {priceRange}</p>
                        <input className={style.priceInput} type='range'
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            min={600}
                            max={700000} />
                    </div>
                    <div className={style.category}>
                        <h3>Category</h3>
                        <div>
                            <input type="checkbox" id="clothing" onChange={() => handleCheckCategory('Clothing')} />
                            <label htmlFor="clothing">Clothing</label>
                        </div>
                        <div>
                            <input type="checkbox" id="electronics" onChange={() => handleCheckCategory('Electronics')} />
                            <label htmlFor="electronics">Electronics</label>
                        </div>
                        <div>
                            <input type="checkbox" id="footwear" onChange={() => handleCheckCategory('Footwear')} />
                            <label htmlFor="footwear">Footwear</label>
                        </div>
                        <div>
                            <input type="checkbox" id="jewellery" onChange={() => handleCheckCategory('Jewellery')} />
                            <label htmlFor="jewellery">Jewellery</label>
                        </div>
                    </div>
                </div>
                <div className={style.prodCon}>
                    <input className={style.searchBar} type='search' value={searchField} onChange={(e) => setSearchField(e.target.value)} placeholder='Search by Name' />
                    <div className={style.prodList}>
                        {
                            // Display ProductCard component for each product in the filtered list
                            searchAndFilterResult.map((prod, ind) => (
                                <ProductCard id={prod.id} key={ind} />
                            ))
                        }
                    </div>
                </div>
            </div>
    );
}
