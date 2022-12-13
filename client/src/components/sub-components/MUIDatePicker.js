import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';

class MUIDatePicker extends Component {
    render() {
        let startDate = this.props.startDate;
        let endDate = this.props.endDate;
        let dateHandler = this.props.dateHandler;

        return(
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateRangePicker
                    startText=""
                    endText=""
                    disableFuture
                    value={[startDate, endDate]}
                    onChange={(newValue) => {
                        if(newValue[0] !== null && newValue[1] !== null)
                            dateHandler(newValue);
                    }}
                    renderInput={(startProps, endProps) => (
                    <React.Fragment>
                        <TextField 
                        {...startProps} 
                        sx={{ backgroundColor: "#FAFAFA" }} 
                        InputProps= {{ 
                            style: {
                                height: 32,
                                fontSize: 14,
                                fontFamily: "Adobe Clean",
                                color: "#4B4B4B"
                            }
                        }}/>
                        <Box sx={{ mx: 2, fontFamily: "Adobe Clean", fontSize: 14, color: "#6E6E6E" }}> to </Box>
                        <TextField 
                        {...endProps} 
                        sx={{ backgroundColor: "#FAFAFA" }}
                        InputProps= {{ 
                            style: {
                                height: 32,
                                fontSize: 14,
                                fontFamily: "Adobe Clean",
                                color: "#4B4B4B"
                            } 
                        }} />
                    </React.Fragment>
                    )}
                />
            </LocalizationProvider>    
        )
    }
}

export default MUIDatePicker;
