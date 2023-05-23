import React, { useContext, useState,useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { DataContext } from '../store/GlobalState'
import Cookie from 'js-cookie'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { CgMenuRound } from 'react-icons/cg';

import filterSearch from '../utils/filterSearch'



function NavBar() {
    const router = useRouter()
    const { state, dispatch } = useContext(DataContext)
    const { auth, cart } = state
    ////////////////////

    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('')
    const [category, setCategory] = useState('')

    //const {categories} = state
    const categories = state.categories.filter(cat => cat.categorytype === '1');
    const categories2 = state.categories.filter(cat => cat.categorytype === '2');


    const handleSort = (value) => {
        setSort(value);
        filterSearch({ router, sort: value });
        // Yêu cầu router và filterSearch được truyền vào từ đâu đó khác.
        // Nếu không sẽ gây lỗi ReferenceError.
    };

    useEffect(() => {
        filterSearch({router, search: search ? search.toLowerCase() : 'all'})
    },[search])
    const [selectedCategory, setSelectedCategory] = useState("all");

    const handleSelectCategorySach = (categoryId) => {
        setSelectedCategory(categoryId);
        const selectedCat = categories.find(cat => cat._id === categoryId && cat.categorytype === '1');
        filterSearch({ router, category: selectedCat && selectedCat._id });
        // Yêu cầu router và filterSearch được truyền vào từ đâu đó khác.
        // Nếu không sẽ gây lỗi ReferenceError.
    };
    const handleSelectCategoryDCHT = (categoryId) => {
        setSelectedCategory(categoryId);
        const selectedCat = categories2.find(cat => cat._id === categoryId && cat.categorytype === '2');
        filterSearch({ router, category: selectedCat && selectedCat._id });
        // Yêu cầu router và filterSearch được truyền vào từ đâu đó khác.
        // Nếu không sẽ gây lỗi ReferenceError.
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hover, setHover] = useState(false); // tạo state mới

    const toggle = () => setDropdownOpen(!dropdownOpen);

    const onMouseEnter = () => setHover(true); // xác định trạng thái hover
    const onMouseLeave = () => setHover(false);

    ////////////////////

    const isActive = (r) => {
        if (r === router.pathname) {
            return " active"
        } else {
            return ""
        }
    }

    const handleLogout = () => {
        Cookie.remove('refreshtoken', { path: 'api/auth/accessToken' })
        localStorage.removeItem('firstLogin')
        dispatch({ type: 'AUTH', payload: {} })
        dispatch({ type: 'NOTIFY', payload: { success: 'Logged out!' } })
        return router.push('/')
    }

    const adminRouter = () => {
        return (
            <>
                <Link href="/users">
                    <a className="dropdown-item">Users</a>
                </Link>
                <Link href="/create">
                    <a className="dropdown-item">Products</a>
                </Link>
                <Link href="/categories">
                    <a className="dropdown-item">Categories</a>
                </Link>
                <Link href="/report">
                    <a className="dropdown-item">Report</a>
                </Link>
            
            </>
        )
    }

    const loggedRouter = () => {
        return (
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src={auth.user.avatar} alt={auth.user.avatar}
                        style={{
                            borderRadius: '50%', width: '40px', height: '40px',
                            transform: 'translateY(-3px)', marginRight: '3px'
                        }} /> {auth.user.name}
                </a>

                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <Link href="/profile">
                        <a className="dropdown-item">Profile</a>
                    </Link>
                    {
                        auth.user.role === 'admin' && adminRouter()
                    }
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                </div>
            </li>
        )
    }

    return (
        //<nav className="navbar navbar-expand-lg navbar-light bg-light" >//chinh mau menu
        //<nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor: "#FFCCCC", position: "fixed", top: 0, left: 0, right: 0, zIndex: 999}}>
       // <div style={{paddingBottom: "110px"}}>
        <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor: "#FFCCCC"}}>
            <div>

                <Dropdown isOpen={dropdownOpen || hover} toggle={toggle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                    <DropdownToggle className="my-custom-toggle">
                        <CgMenuRound />
                    </DropdownToggle>
                    <DropdownMenu >
                        <div className="d-flex flex-column flex-md-row">
                            <div>
                                <h5 style={{ color: 'blue', textAlign: 'center' }}>Books </h5>

                                {categories.map(cat => (
                                    <DropdownItem key={cat._id} onClick={() => handleSelectCategorySach(cat._id)}>
                                        {cat.name}
                                    </DropdownItem>
                                ))}
                            </div>
                            <div>

                                <h5 style={{ color: 'blue', textAlign: 'center' }}>Learning tools </h5>
                                {categories2.map(cat => (
                                    <DropdownItem key={cat._id} onClick={() => handleSelectCategoryDCHT(cat._id)}>
                                        {cat.name}
                                    </DropdownItem>
                                ))}
                            </div>
                            <div>

                                <h5 style={{ color: 'blue', textAlign: 'center' }}>Filter </h5>
                                <DropdownItem onClick={() => handleSort('-createdAt')}>Newest</DropdownItem>
                                <DropdownItem onClick={() => handleSort('oldest')}>Oldest</DropdownItem>
                                <DropdownItem onClick={() => handleSort('-sold')}>Best sales</DropdownItem>
                                <DropdownItem onClick={() => handleSort('-price')}>Price: Hight-Low</DropdownItem>
                                <DropdownItem onClick={() => handleSort('price')}>Price: Low-Hight</DropdownItem>
                            </div>
                        </div>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Link href="/">
                <a className="navbar-brand">
                    <img src="https://res.cloudinary.com/dykde8jnj/image/upload/v1679642544/336508493_940059563789425_1287563313732507732_n_m0iszq.png" alt="logo" height={80} width={120} />
                </a>
            </Link>
            <form autoComplete="off" className="mt-2 col-md-7 px-0" style={{marginRight: '20px'}}>
                <input type="text" className="form-control" list="title_product" placeholder="Search in Đông Nam Á"
                value={search.toLowerCase()} onChange={e => setSearch(e.target.value)} />
            </form>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation" style={{marginRight: '20px'}}>
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                <ul className="navbar-nav p-1">
                    <li className="nav-item">
                        <Link href="/cart">
                            <a className={"nav-link" + isActive('/cart')}>
                                <i className="fas fa-shopping-cart position-relative" aria-hidden="true">
                                    <span className="position-absolute"
                                        style={{
                                            padding: '3px 6px',
                                            background: '#ed143dc2',
                                            borderRadius: '50%',
                                            top: '-10px',
                                            right: '-10px',
                                            color: 'white',
                                            fontSize: '14px'
                                        }}>
                                        {cart.length}
                                    </span>
                                </i> 
                            </a>
                        </Link>
                    </li>

                    {
                        Object.keys(auth).length === 0
                            ? <li className="nav-item">
                                <Link href="/signin">
                                    <a className={"nav-link" + isActive('/signin')}>
                                        <i className="fas fa-user" aria-hidden="true"></i> Sign in
                                    </a>
                                </Link>
                            </li>
                            : loggedRouter()
                    }
                </ul>
            </div>
        </nav>
        //</div>
    )
}

export default NavBar
