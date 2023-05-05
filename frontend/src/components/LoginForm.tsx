export default function LoginForm() {
    return (
        <form>
            <label>
                Username:
                <input type='text' name='username'></input>
            </label>
            <label>
                <input type='password' name='password'></input>
            </label>
        </form>
    )
}