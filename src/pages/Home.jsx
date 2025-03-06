import { Container } from 'react-bootstrap';
import { useAuth } from '../../AuthContext';
function Home() {
    const {user,signOut} = useAuth();
    return (
        <Container fluid className="p-5">
            <h1>Home</h1>
            <h1>Welcome, {user?.role}!</h1>
             <button onClick={signOut}>Sign Out</button>
        </Container>
    );
}

export default Home;
