import React, { useContext, useState } from 'react';
import { GlobalState } from '../../GlobalState';
import Menu from './icon/menu.svg';
import Close from './icon/close.svg';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BiUser } from 'react-icons/bi';
import { BsCart3 } from 'react-icons/bs';
import { HiOutlineLogout } from 'react-icons/hi';
import { AiOutlineHistory } from 'react-icons/ai';
import Logo from './icon/logochocu.jpg';
import { gsap } from 'gsap';

function Header() {
    const state = useContext(GlobalState);
    const [isLogged] = state.userAPI.isLogged;
    const [isAdmin] = state.userAPI.isAdmin;
    const [cart] = state.userAPI.cart;
    const [menu, setMenu] = useState(false);

    const [isLoged, setIsLoged] = useState(false); // Giả sử bạn sử dụng state để theo dõi trạng thái đăng nhập
    const handleCartClick = () => {
        if (!isLoged) {
            alert('Please login to access the cart.');
            console.log('aa');
        } else {
            return;
        }
    };

    const onEnter = ({ currentTarget }) => {
        gsap.to(currentTarget, {
            repeatDelay: 1,
            yoyo: true,
            scale: 1.3,
        });
    };
    const onLeave = ({ currentTarget }) => {
        gsap.to(currentTarget, { scale: 1 });
    };

    const logoutUser = async () => {
        await axios.get('/user/logout');
        localStorage.removeItem('firstLogin');
        window.location.href = '/';
    };
    const ToggleSidebar = () => {
        const [isOpen, setIsopen] = useState(false);
        const ToggleSidebar = () => {
            isOpen === true ? setIsopen(false) : setIsopen(true);
        };
        return (
            <>
                <div className="btn btn-primary" onClick={ToggleSidebar}>
                    <i className="fa fa-bars"></i>
                    <div className={`sidebar ${isOpen === true ? 'active' : ''}`}>
                        <div className="sd-body">
                            <ul>
                                <li>
                                    <Link to="/create_product">クリエート プロダクト</Link>
                                </li>
                                <li>
                                    <Link to="/category">クリエートカテゴリ</Link>
                                </li>
                                {/* <li>
                  <Link to="/revenue">Revenue</Link>
                </li> */}
                            </ul>
                        </div>
                    </div>
                    <div className={`sidebar-overlay ${isOpen === true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
                </div>
            </>
        );
    };

    const adminRouter = () => {
        return (
            <>
                <ToggleSidebar />
            </>
        );
    };

    const loggedRouter = () => {
        return (
            <>
                <li onMouseEnter={onEnter} onMouseLeave={onLeave}>
                    <Link to="/history">
                        <AiOutlineHistory />
                    </Link>
                </li>
                <li onMouseEnter={onEnter} onMouseLeave={onLeave}>
                    <Link to="/infor">
                        <BiUser />
                    </Link>
                </li>
                <li onMouseEnter={onEnter} onMouseLeave={onLeave}>
                    <Link to="/" onClick={logoutUser}>
                        <HiOutlineLogout />
                    </Link>
                </li>
            </>
        );
    };

    const styleMenu = {
        left: menu ? 0 : '-100%',
    };

    return (
        <header>
            <div className="menu" onClick={() => setMenu(!menu)}>
                <img src={Menu} alt="" width="30" />
            </div>
            <div className="logo">
                <h1>
                    <Link to="/">
                        {isAdmin ? (
                            //
                            'Admin'
                        ) : (
                            <img src={Logo} alt="PetFirst" />
                        )}
                    </Link>
                </h1>
            </div>
            <ul style={styleMenu}>
                <li onMouseEnter={onEnter} onMouseLeave={onLeave}>
                    <Link to="/">{'home'}</Link>
                </li>
                <li onMouseEnter={onEnter} onMouseLeave={onLeave}>
                    <Link to="/products">{isAdmin ? 'Products' : 'Shop'}</Link>
                </li>
                {isAdmin && adminRouter()}
                {isLogged ? (
                    loggedRouter()
                ) : (
                    <li onMouseEnter={onEnter} onMouseLeave={onLeave}>
                        <Link to="/nlogin">NLOGIN</Link>
                    </li>
                )}
                <li onClick={() => setMenu(!menu)}>
                    <img src={Close} alt="" width="30" className="menu" />
                </li>
            </ul>
            {isLogged ? (
                <div className="cart-icon">
                    <p>bbb</p>
                    <span>{cart.length} qqq</span>
                    <Link to="/cart">
                        {<img src={cart} alt="" width="30" />}
                        <BsCart3 />
                    </Link>
                </div>
            ) : (
                <div className="cart-icon">
                    <p>aaaa</p>
                    <span>{cart.length}</span>
                    <Link to="/nlogin">
                        {<img src={cart} alt="" width="30" />}
                        <BsCart3 />
                    </Link>
                </div>
            )}
        </header>
    );
}
// comments

export default Header;
