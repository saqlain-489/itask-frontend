import './landing.module.css'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();
    const tick = <i className="bi bi-check2-all"></i>

    function handleclick() {
        navigate('/Signin')
    }



    return (
        <>
            <div className="particle particle1"></div>
            <div className="particle particle2"></div>
            <div className="particle particle3"></div>
            <div className="particle particle4"></div>

            <section className='landing' >
                <nav className='navbar'>
                    <div >
                        <a href="#" className="logo">
                            <img className='  d-inline-block' src="src/Todo/images/logo.png" alt="iTask" width={'50px'} height={'auto'} />
                            <h2 className='  d-inline-block name' >iTask</h2>
                        </a>
                    </div>
                    <div>
                        <ol className='d-flex gap-4 list-unstyled pt-3 navlist'>
                            <li><a href="#">Home</a></li>
                            <li><a href="#feature">Feature</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><a href="#faqs">FAQs</a></li>
                        </ol>
                    </div>
                    <div>
                        <button onClick={handleclick} className='btn '>Log in</button>

                    </div>
                </nav>
                <div className='hero'>
                    <h1>Your Daily Tasks Organized Effortlessly</h1>

                    <p>iTask helps you manage daily tasks, assign teammates, and track progress
                        — All in a simple, fast visual workspace.</p>
                    <Link to="/Signup">
                        <button className='btn'>Get Started</button>
                    </Link>
                </div>

            </section>
            <section id='feature'>
                <h3 className='heading'>Features</h3>
                <p className="feature-subtitle">
                    Everything you need to stay organized, productive, and in control.
                </p>
                <div className="cardcontainer">
                    <div className="card">
                        <h5 className="card-title">🧠 Smart Task Management</h5>
                        <p className='card-text'>Create, edit, and delete tasks instantly with a clean and intuitive interface. Stay focused by organizing your todos by priority and deadlines — so you always know what matters most. </p>
                    </div>
                    <div className="card">
                        <h5 className="card-title">⚡ Seamless Sync & Accessibility</h5>
                        <p className='card-text'>Your tasks are saved securely in the cloud, accessible anytime from any device. Whether you’re on your phone or desktop, your to-dos stay perfectly in sync — no extra setup needed. </p>
                    </div>
                    <div className="card">
                        <h5 className="card-title">🎯 Intuitive Editing & Tracking</h5>
                        <p className='card-text'>Made a mistake or changed your plans? Easily update, edit, or mark tasks as complete with one click. Keep track of your daily progress and feel the satisfaction of checking off each goal. </p>
                    </div>
                    <div className="card">
                        <h5 className="card-title">🔒 Secure Login & Personal Dashboard</h5>
                        <p className='card-text'>Sign up and log in securely to manage your personal to-do list. Your data stays private and protected, giving you a safe space to plan, organize, and achieve your daily goals. </p>
                    </div>
                </div>
            </section>
            <section id='pricing'>

                <h3 className='heading'>Pricing</h3>
                <p>Stay productive at every level with simple, affordable plans designed to fit your workflow.</p>
                <div className="pcardcontainer">

                    <div className="pricecard">
                        <h5 className='card-title'>🪶 Free Plan</h5>
                        <ul className='list-unstyled'>
                            <li> {tick} Create and manage unlimited tasks</li>
                            <li> {tick} Basic editing and completion tracking  </li>
                            <li>{tick} Access from any device</li>
                            <li>{tick} Simple, clean dashboard</li>
                            <li>{tick} Secure login with Firebase</li>
                        </ul>
                        <h5 >$0 / month</h5>
                    </div>

                    <div className="pricecard">
                        <h5 className='card-title'>  ⚙️ Pro Plan</h5>

                        <ul className='list-unstyled'>
                            <li>  {tick} Everything in Free, plus —</li>
                            <li>  {tick} Cloud sync across devices</li>
                            <li>{tick} Priority sorting and reminders</li>
                            <li>{tick} Custom themes and layouts</li>
                            <li>{tick} Daily progress tracker</li>
                            <li>{tick} Smart notifications & alerts</li>
                        </ul>
                        <h5 >$5 / month</h5>
                    </div>
                    <div className="pricecard">
                        <h5 className='card-title'>  🚀 Team Plan
                        </h5>
                        <ul className='list-unstyled'>
                            <li>{tick} Everything in Pro, plus —</li>
                            <li>{tick} Shared task lists & permissions</li>
                            <li>{tick} Real-time updates across members</li>
                            <li>{tick} Team progress analytics & insights</li>
                            <li>{tick} Role-based access control</li>
                            <li>{tick} File attachments and notes</li>
                            <li>{tick} Dedicated customer support</li>
                        </ul>
                        <h5  >$10 / month</h5>
                    </div>

                </div>
            </section>

            <section id='faqs'>
                <h3 className='heading'>❓ Frequently Asked Questions</h3>
                <div className="accordion mt-5" id="accordionExample">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                1. Do I need an account to use the app?
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                You can try the basic features without signing up, but creating an account lets you save and sync your tasks securely across devices.                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                2. Is my data safe?
                            </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                Absolutely. All your data is securely stored in the cloud using encrypted connections through Firebase Authentication.                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                3. Can I access my to-dos on mobile?
                            </button>
                        </h2>
                        <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                Yes! The app works smoothly on both desktop and mobile browsers — no downloads required.                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsefour" aria-expanded="false" aria-controls="collapseThree">
                                4. What’s included in the free plan?
                            </button>
                        </h2>
                        <div id="collapsefour" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                The free plan gives you unlimited tasks, basic editing, and secure login — perfect for personal use.
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseThree">
                                5. Can I collaborate with my team?
                            </button>
                        </h2>
                        <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                Yes, our Team Plan allows shared task lists, real-time updates, and role-based permissions for easy collaboration.                                 </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseThree">
                                6. How can I upgrade my plan?                            </button>
                        </h2>
                        <div id="collapseSix" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                Simply log into your dashboard and select “Upgrade.” You can switch or cancel anytime — no hidden charges.                                 </div>
                        </div>
                    </div>
                </div>
                <div className="ccard">
                    <h2>Ready to boost your productivity?</h2>
                    <p>Join thousands of users already organizing their days smarter.</p>
                    <Link to="/Signup">
                        <button className='btn'>Get Started — It’s Free</button>
                    </Link>
                </div>
            </section>
            <section className='footer-container'>
                <footer>
                    <div className="row g-4 ">
                        <div className="col-12 col-md-4">
                            <h2 className="pb-2 pb-md-4"><img src="src/Todo/images/logowithbg.jpg" alt="" width={'50px'} />
                                {' '} iTask</h2>
                            <p>Copyright © 2020 Landify UI Kit.</p>
                            <p className="pb-0 pb-md-4">All rights reserved</p>
                            <div className="ico mb-4">
                                <i className="bi bi-instagram"></i>
                                <i className="bi bi-twitter"></i>
                                <i className="bi bi-youtube"></i>
                            </div>
                        </div>
                        <div className="col-5 col-md-2">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#">About us</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Contact us</a></li>
                                <li><a href="#">Pricing</a></li>
                                <li><a href="#">Testimonials</a></li>

                            </ul>
                        </div>
                        <div className="col-5 col-md-2">
                            <h4>Support</h4>
                            <ul>
                                <li><a href="#">Help center</a></li>
                                <li><a href="#">Terms of service</a></li>
                                <li><a href="#">Legal</a></li>
                                <li><a href="#">Privacy policy</a></li>
                                <li><a href="#">Status</a></li>
                            </ul>
                        </div>
                        <div className="col-12 col-md-3">
                            <h4>Stay up to date</h4>
                            <div className="m-auto input-group input search">

                                <input type="text"
                                    className="form-control   text-light  border-0" id="search"
                                    autoComplete="off"
                                    placeholder="Your email address" />

                                <label htmlFor="search" className="input-group-text  border-0 ">
                                    <button type="button" className="btn p-0 text-light"><i className="bi bi-send text-black"></i></button>
                                </label>
                            </div>
                        </div>
                    </div>
                </footer>
            </section>
        </>
    )
}