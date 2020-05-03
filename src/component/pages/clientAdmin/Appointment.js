import React from "react";
import AuthContext from "../../../data/AuthContext"
import { useLocation, useRouteMatch, Link } from 'react-router-dom';

//material-ui components:
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import Popover from '@material-ui/core/Popover';
import Box from '@material-ui/core/Box';
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  }
});


export default function Appointment() {
  const authContext = React.useContext(AuthContext)
  const classes = useStyles();
  let location = useLocation();
  let { path } = useRouteMatch();
  
  const [error, setError] = React.useState(null);
  const [appoitnment, setAppoitnment] = React.useState(null);
  const [comment, setComment] = React.useState(null);
  const [value, setValue] = React.useState('female');


  React.useEffect(() => {
    const start = async () => {
      let data = await authContext.API.getIndivAppointment(location.pathname.toString().split("/")[3]) 
      console.log(data)
     // let data = {patient: "john smith", appointmentTime: '2020-04-11T03:36:57.292Z', doctorName: 'john doe', status: 'Pending', comments: "", reason: "Flu", _id: 1}
      if (data === undefined){
        console.log("error")
        setError("Error grabbing data from the server.")
      } else if (data === undefined){
        console.log("error")
        setError("Error grabbing data from the server.")
      } else {
        authContext.API.readToken(authContext.authState).then(function(result){
          if (result.role !== 'CLIENT_ADMIN'){
           return setError("404. Please try again.")
          } else {
            setAppoitnment(data.data)
          }
        })
      }
    }
    start()
  }, [])


  const formRow = (label, data) => {
    return (
      <React.Fragment>
        <Grid item xs={4}>
        {label}
        </Grid>
        <Grid item xs={4}>
        {data}
        </Grid>
        </React.Fragment>
    );
  }

  const submitComment = async (e) => {
    if (comment === "" || comment === null){
      return setError("Can not be blank.")
    }

    let reqBody = {
      "doctorName": appoitnment.doctorName,
      "appointmentTime": appoitnment.appointmentTime,
      "reason": appoitnment.reason,
      "status": appoitnment.status,
      "comment": comment,
      "clinic": appoitnment.clinic,
      "patient": appoitnment.patient
  };

       let result = await authContext.API.updateAppointment(appoitnment['_id'], reqBody);
        if (result.status === 200){
         setAppoitnment(result.data)
         setError("")
        } else if (result.status === 400) {
         console.log(result)
         setError("Error submitting data to the server.")
        }
  }

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleStatus = (e) => {
    alert('hello')
  };


  const renderAppointment = () => {
    return( 
    <div> <Card className={classes.root} variant="outlined">
    <CardContent>
    <Grid container spacing={1}>
   <Grid container item xs={12} spacing={3}>
   {formRow("Patient Name:", appoitnment.patient)}
   </Grid>
   <Grid container item xs={12} spacing={3}>
   {formRow("Appointment Time:", appoitnment.appointmentTime.split('T')[0])}
   </Grid>
   <Grid container item xs={12} spacing={3}>
   {formRow("Doctor:", appoitnment.doctorName)}
   </Grid>
   <Grid container item xs={12} spacing={3}>
   {formRow("Reason For Visit:", appoitnment.reason)}
   </Grid>
   {appoitnment.comment && appoitnment.comment !== "" ? <Grid container item xs={12} spacing={3}>
   {formRow("Comments:", appoitnment.comment)}
   </Grid> : ""}
   <Grid container item xs={12} spacing={3}>
   {formRow("Appointment Status:", appoitnment.status)}
   </Grid>
  </Grid>
 </CardContent>

 <CardActions style={{display: 'block', width: '50%'}}>   
 <PopupState variant="popover" popupId="demo-popup-popover">
      {(popupState) => (
        <div>
       <Button size="small" variant="contained" color="primary" style={{marginTop:"2%", marginBottom: '2%'}} {...bindTrigger(popupState)}>Change Appointment Status: </Button>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
           >
            <Box p={2}>
            <StatusChange appoitnment={appoitnment["_id"]} />
            </Box>
          </Popover>
        </div>
      )}
    </PopupState>
   <TextField
          multiline={true}
          fullWidth={true}
          label="None"
          id="outlined-margin-none"
          className={classes.textField}
          label="Comments"
          variant="outlined"
          onChange={handleCommentChange}
        />
   <Button size="small" variant="contained" color="primary" style={{marginTop:"2%"}} onClick={submitComment}>Submit</Button>
  </CardActions>
  </Card>
  
  <Link to={`${path.substring(0, path.length - 4)}`} style={{textDecoration: 'none', color: 'inherit'}}> <Button variant="contained" style={{marginTop: '2%', backgroundColor: 'black', color: 'white'}}> Return to list </Button> </Link>
  </div>)
}

const updateStatus = () => {

}

const handleChange = (event) => {
  setValue(event.target.value);
};

const StatusChange = (appoitnment) => {
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          {/* <FormControl component="fieldset">
      <FormLabel component="legend">Status:</FormLabel>
      <FormGroup aria-label="position" row>
        <FormControlLabel
          value="top"
          control={<Radio color="primary" />}
          label="Checked In"
          labelPlacement="top"
        />
          <FormControlLabel
          value="top"
          control={<Radio color="primary" />}
          label="Pending"
          labelPlacement="top"
        />
          <FormControlLabel
          value="top"
          control={<Radio color="primary" />}
          label="Canceled"
          labelPlacement="top"
        />


            <Button
              onClick={updateStatus}
              fullWidth
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
            </FormGroup>
        </FormControl> */}
        <FormControl component="fieldset">
      <FormLabel component="legend">Status</FormLabel>
      <br/>
      <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}  aria-label="position" row>
        <FormControlLabel value="female" control={<Radio />} label="Checked In" labelPlacement="top" />
        <FormControlLabel value="male" control={<Radio />} label="Pending" labelPlacement="top" />
        <FormControlLabel value="other" control={<Radio />} label="Canceled" labelPlacement="top" />
      </RadioGroup>
      <Button
              onClick={updateStatus}
              fullWidth
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
    </FormControl>
        </div>
      </Container>
    </div>
  );    }

    return(
      <div>
        {error !== null ? error : "" }
        {appoitnment !== null && appoitnment !== undefined ? renderAppointment(appoitnment) : ""}
      </div>
    ) 
  }