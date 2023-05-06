import './LoginForm.css'

export default function LoginForm() {
    return (
        <div className='container'>
            <div className='logo-container'>
                <h2>NEIGHBORHOOD</h2>
            </div>
            <form>
                <label htmlFor='username'>USERNAME:</label>
                <input type='text' name='username' id='username'></input>

                <label htmlFor='password'>PASSWORD:</label>
                <input type='password' name='password' id='password'></input>

                <input type='submit' value='LOGIN'></input>
            </form>
        </div>
    )
}