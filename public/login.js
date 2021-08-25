

firebase.initializeApp(firebaseConfig);

function Login(props){
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');
  return (
    <Card
      bgcolor="secondary"
      header="Login"
      status={status}
      body={show ? 
        <LoginForm setShow={setShow} setStatus={setStatus} authorization={props.authorization}/> :
        <LoginMsg setShow={setShow} setStatus={setStatus}/>}
    />
  ) 
}

function LoginMsg(props){
  return(<>
    <h5>Success</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => props.setShow(true)}>
        Authenticate again
    </button>
  </>);
}

function LoginForm(props){
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');

  function handle(){
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(
      email,
      password
    );
    promise.then((resp) => {
      resp.user.getIdToken().then(token => {
        window.sessionStorage.setItem('tokenGoodBank', token);
        window.location.href = './';
      
      });
    });
    promise.catch((e) => console.log(e.message));
  }


  return (<>

    Email<br/>
    <input type="input"
      className="form-control"
      placeholder="Enter email"
      value={email}
      onChange={e => setEmail(e.currentTarget.value)}/><br/>

    Password<br/>
    <input type="password" 
      className="form-control" 
      placeholder="Enter password" 
      value={password} 
      onChange={e => setPassword(e.currentTarget.value)}/><br/>

    <button type="submit" className="btn btn-light" onClick={handle}>Login</button>
   
  </>);
}