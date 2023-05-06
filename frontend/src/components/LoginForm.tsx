export default function LoginForm() {
    const formStyle = {
        width: '20vw',
        border: '1px solid black',
        padding: '10px',
        display: 'grid',
        gridTemplateColumns: '1fr 4fr ',
        gridGap: '5px',
        backgroundColor: '#f2f2f2',
        borderRadius: '5px'
    };

    const labelStyle = {
        textAlign: 'left' as const,
        fontWeight: 'bold'
    };

    const inputStyle = {
        padding: '5px',
        border: '2px solid #ccc',
        borderRadius: '5px',
        width: '100%',
        boxSizing: 'border-box' as const
    }

    const submitStyle = {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        justifySelf: 'center',
        alignSelf: 'center',
        gridColumn: '1 / span 2'
    }

    return (
        <form style={formStyle}>
                <label style={labelStyle} htmlFor='username'>Username:</label>
                <input style={inputStyle} type='text' name='username' id='username'></input>

                <label style={labelStyle} htmlFor='password'>Password:</label>
                <input style={inputStyle} type='password' name='password' id='password'></input>

                <input style={submitStyle} type='submit' value='Login'></input>
        </form>
    )
}