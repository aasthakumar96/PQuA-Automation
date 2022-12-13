import React, {Component} from 'react';
import { Snackbar } from '@mui/material'
import { Alert } from '@mui/material'

class SnackbarNotif extends Component {
    render(){
        let message = this.props.message;
        let severity = this.props.severity;
        let handler = this.props.handler;

        return(
            <Snackbar
                open="true"
                autoHideDuration={3000}
                anchorOrigin={{vertical : 'bottom', horizontal : 'center'}}
                onClose={handler}
                >
                <Alert severity={severity} variant="filled" sx={{ position: "absolute", bottom: 30, maxWidth: '50%', fontStyle: "Adobe Clean" }}>
                {message}
                </Alert>
            </Snackbar>
        )
    }
}

export default SnackbarNotif;