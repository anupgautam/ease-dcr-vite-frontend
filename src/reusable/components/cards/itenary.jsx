import { Typography, Box, Card } from "@mui/material";
import React, {useState} from "react";
import { BiChevronDown } from "react-icons/bi";

const Itenary = () =>{
    const [myShow,setMyshow] = useState(false);
    const [myShow1,setMyshow1] = useState(false);
    const [myShow2,setMyshow2] = useState(false);
    const [myShow3,setMyshow3] = useState(false);
    const [myShow4,setMyshow4] = useState(false);
    const [myShow5,setMyshow5] = useState(false);
    const [myShow6,setMyshow6] = useState(false);
    const [myShow7,setMyshow7] = useState(false);
    const [myShow8,setMyshow8] = useState(false);
    const [myShow9,setMyshow9] = useState(false);
    const [myShow10,setMyshow10] = useState(false);
    const [myShow11,setMyshow11] = useState(false);
    const [myShow12,setMyshow12] = useState(false);
    const [myShow13,setMyshow13] = useState(false);
    const [myShow14,setMyshow14] = useState(false);
    return(
        <Box>
            <Card elevation={0}>
                <Box>
                    <Box className="day-day-it-ne-ad">
                        <Typography className="day-ad-it-txt">Day to Day Itenary</Typography>
                    </Box>
                    <Box>
                    <Box className="day-iten-ary">
                        <Box>
                            <Typography className="day-no-ad-it-nery">Day1:
                            </Typography>
                        </Box>
                        <Box className="widh-loc-arr-ad">
                            <Typography className="arri-val-loc-ation">Arrival in Kathmandu</Typography>
                        </Box>
                        <Box onClick={!myShow==true?()=>setMyshow(true):()=>setMyshow(false)}>
                           <BiChevronDown className="bi-che-vron-ad-de" />
                        </Box>
                        </Box>
                        {
                               myShow==true?
                               <Box>
                               <Typography className="hidden-text">Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer</Typography>
                                   </Box>:null
                           }
                        </Box>
                    <Box className="hr-line-ad-iten-ary"></Box>
                    <Box>
                    <Box className="day-iten-ary">
                        <Box>
                            <Typography className="day-no-ad-it-nery">Day2:</Typography>
                        </Box>
                        <Box className="widh-loc-arr-ad">
                            <Typography className="arri-val-loc-ation">Drive from Kathmandu to Pokhara[210km- 6 hours] & Pokhara Sightseeing</Typography>
                        </Box>
                        <Box onClick={!myShow1==true?()=>setMyshow1(true):()=>setMyshow1(false)}>
                           <BiChevronDown className="bi-che-vron-ad-de" />
                        </Box>
                        </Box>
                        {
                               myShow1==true?
                               <Box>
                               <Typography className="hidden-text">Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer</Typography>
                                   </Box>:null
                           }
                    </Box>
                    <Box className="hr-line-ad-iten-ary"></Box>
                    <Box>
                    <Box className="day-iten-ary">
                        <Box>
                            <Typography className="day-no-ad-it-nery">Day3:</Typography>
                        </Box>
                        <Box className="widh-loc-arr-ad">
                            <Typography className="arri-val-loc-ation">Pokhara(915m). Drive to Nayapul for approximately 1.5hrs and trek to Tikhedhunga(1525m)</Typography>
                        </Box>
                        <Box onClick={!myShow2==true?()=>setMyshow2(true):()=>setMyshow2(false)}>
                           <BiChevronDown className="bi-che-vron-ad-de" />
                        </Box>
                        </Box>
                        {
                               myShow2==true?
                               <Box>
                               <Typography className="hidden-text">Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer</Typography>
                                   </Box>:null
                           }
                    </Box>
                    <Box className="hr-line-ad-iten-ary"></Box>
                    <Box>
                    <Box className="day-iten-ary">
                        <Box>
                            <Typography className="day-no-ad-it-nery">Day4:</Typography>
                        </Box>
                        <Box className="widh-loc-arr-ad">
                            <Typography className="arri-val-loc-ation">Trek from Tikhedhunga to Ghorepani(2750 m)</Typography>
                        </Box>
                        <Box onClick={!myShow3==true?()=>setMyshow3(true):()=>setMyshow3(false)}>
                           <BiChevronDown className="bi-che-vron-ad-de" />
                        </Box>
                        </Box>
                        {
                               myShow3==true?
                               <Box>
                               <Typography className="hidden-text">Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer</Typography>
                                   </Box>:null
                           }
                    </Box>
                    <Box className="hr-line-ad-iten-ary"></Box>
                    <Box>
                    <Box className="day-iten-ary">
                        <Box>
                            <Typography className="day-no-ad-it-nery">Day5:</Typography>
                        </Box>
                        <Box className="widh-loc-arr-ad">
                            <Typography className="arri-val-loc-ation">Ghorepani to Poon Hill(3210m) to Tadapani(2520m)</Typography>
                        </Box>
                        <Box onClick={!myShow4==true?()=>setMyshow4(true):()=>setMyshow4(false)}>
                           <BiChevronDown className="bi-che-vron-ad-de" />
                        </Box>
                        </Box>
                        {
                               myShow4==true?
                               <Box>
                               <Typography className="hidden-text">Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer</Typography>
                                   </Box>:null
                           }
                    </Box>
                    <Box className="hr-line-ad-iten-ary"></Box>
                    <Box>
                    <Box className="day-iten-ary">
                        <Box>
                            <Typography className="day-no-ad-it-nery">Day6:</Typography>
                        </Box>
                        <Box className="widh-loc-arr-ad">
                            <Typography className="arri-val-loc-ation">Trek from Tadapani to Chhomrong(2040m)</Typography>
                        </Box>
                        <Box onClick={!myShow5==true?()=>setMyshow5(true):()=>setMyshow5(false)}>
                           <BiChevronDown className="bi-che-vron-ad-de" />
                        </Box>
                        </Box>
                        {
                               myShow5==true?
                               <Box>
                               <Typography className="hidden-text">Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer</Typography>
                                   </Box>:null
                           }
                    </Box>
                    <Box className="hr-line-ad-iten-ary"></Box>
                    <Box>
                    <Box className="day-iten-ary">
                        <Box>
                            <Typography className="day-no-ad-it-nery">Day7:</Typography>
                        </Box>
                        <Box className="widh-loc-arr-ad">
                            <Typography className="arri-val-loc-ation">Trek from Chhomrong to Bamboo/ Dovan(2580m)</Typography>
                        </Box>
                        <Box onClick={!myShow6==true?()=>setMyshow6(true):()=>setMyshow6(false)}>
                           <BiChevronDown className="bi-che-vron-ad-de" />
                        </Box>
                        </Box>
                        {
                               myShow6==true?
                               <Box>
                               <Typography className="hidden-text">Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer</Typography>
                                   </Box>:null
                           }
                    </Box>
                    <Box className="hr-line-ad-iten-ary"></Box>
                    <Box>
                    <Box className="day-iten-ary">
                        <Box>
                            <Typography className="day-no-ad-it-nery">Day8:</Typography>
                        </Box>
                        <Box className="widh-loc-arr-ad">
                            <Typography className="arri-val-loc-ation">Trek from Dovan to Deurali(3230m)</Typography>
                        </Box>
                        <Box onClick={!myShow7==true?()=>setMyshow7(true):()=>setMyshow7(false)}>
                           <BiChevronDown className="bi-che-vron-ad-de" />
                        </Box>
                        </Box>
                        {
                               myShow7==true?
                               <Box>
                               <Typography className="hidden-text">Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer</Typography>
                                   </Box>:null
                           }
                    </Box>
                    <Box className="hr-line-ad-iten-ary"></Box>
                    <Box>
                    <Box className="day-iten-ary">
                        <Box>
                            <Typography className="day-no-ad-it-nery">Day9:</Typography>
                        </Box>
                        <Box className="widh-loc-arr-ad">
                            <Typography className="arri-val-loc-ation">Trek from Deurali to Annapurna Base Camp(4170m)</Typography>
                        </Box>
                        <Box onClick={!myShow8==true?()=>setMyshow8(true):()=>setMyshow8(false)}>
                           <BiChevronDown className="bi-che-vron-ad-de" />
                        </Box>
                        </Box>
                        {
                               myShow8==true?
                               <Box>
                               <Typography className="hidden-text">Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer</Typography>
                                   </Box>:null
                           }
                    </Box>
                    <Box className="hr-line-ad-iten-ary"></Box>
                    <Box>
                    <Box className="day-iten-ary">
                        <Box>
                            <Typography className="day-no-ad-it-nery">Day10:</Typography>
                        </Box>
                        <Box className="widh-loc-arr-ad">
                            <Typography className="arri-val-loc-ation">Trek from Annapurna Base camp to Bamboo(2500m)</Typography>
                        </Box>
                        <Box onClick={!myShow9==true?()=>setMyshow9(true):()=>setMyshow9(false)}>
                           <BiChevronDown className="bi-che-vron-ad-de" />
                        </Box>
                        </Box>
                        {
                               myShow9==true?
                               <Box>
                               <Typography className="hidden-text">Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer</Typography>
                                   </Box>:null
                           }
                    </Box>
                    <Box className="hr-line-ad-iten-ary"></Box>
                    <Box>
                    <Box className="day-iten-ary">
                        <Box>
                            <Typography className="day-no-ad-it-nery">Day11:</Typography>
                        </Box>
                        <Box className="widh-loc-arr-ad">
                            <Typography className="arri-val-loc-ation">Trek from Bamboo to Jhinu(Hot Spring) 1500m</Typography>
                        </Box>
                        <Box onClick={!myShow10==true?()=>setMyshow10(true):()=>setMyshow10(false)}>
                           <BiChevronDown className="bi-che-vron-ad-de" />
                        </Box>
                        </Box>
                        {
                               myShow10==true?
                               <Box>
                               <Typography className="hidden-text">Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer</Typography>
                                   </Box>:null
                           }
                    </Box>
                    <Box className="hr-line-ad-iten-ary"></Box>
                    <Box>
                    <Box className="day-iten-ary">
                        <Box>
                            <Typography className="day-no-ad-it-nery">Day12:</Typography>
                        </Box>
                        <Box className="widh-loc-arr-ad">
                            <Typography className="arri-val-loc-ation">Trek to nayapul and drive back to Pokhara</Typography>
                        </Box>
                        <Box onClick={!myShow11==true?()=>setMyshow11(true):()=>setMyshow11(false)}>
                           <BiChevronDown className="bi-che-vron-ad-de" />
                        </Box>
                        </Box>
                        {
                               myShow11==true?
                               <Box>
                               <Typography className="hidden-text">Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer</Typography>
                                   </Box>:null
                           }
                    </Box>
                    <Box className="hr-line-ad-iten-ary"></Box>
                    <Box>
                    <Box className="day-iten-ary">
                        <Box>
                            <Typography className="day-no-ad-it-nery">Day13:</Typography>
                        </Box>
                        <Box className="widh-loc-arr-ad">
                            <Typography className="arri-val-loc-ation">Drive from Pokhara to Kathmandu by touris bus that takes around 6 hrs</Typography>
                        </Box>
                        <Box onClick={!myShow12==true?()=>setMyshow12(true):()=>setMyshow12(false)}>
                           <BiChevronDown className="bi-che-vron-ad-de" />
                        </Box>
                        </Box>
                        {
                               myShow12==true?
                               <Box>
                               <Typography className="hidden-text">Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer</Typography>
                                   </Box>:null
                           }
                    </Box>
                    <Box className="hr-line-ad-iten-ary"></Box>
                    <Box>
                    <Box className="day-iten-ary">
                        <Box>
                            <Typography className="day-no-ad-it-nery">Day14:</Typography>
                        </Box>
                        <Box className="widh-loc-arr-ad">
                            <Typography className="arri-val-loc-ation">Kathmandu Sightseeing</Typography>
                        </Box>
                        <Box onClick={!myShow13==true?()=>setMyshow13(true):()=>setMyshow13(false)}>
                           <BiChevronDown className="bi-che-vron-ad-de" />
                        </Box>
                        </Box>
                        {
                               myShow13==true?
                               <Box>
                               <Typography className="hidden-text">Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer</Typography>
                                   </Box>:null
                           }
                    </Box>
                    <Box className="hr-line-ad-iten-ary"></Box>
                    <Box>
                    <Box className="day-iten-ary">
                        <Box>
                            <Typography className="day-no-ad-it-nery">Day15:</Typography>
                        </Box>
                        <Box className="widh-loc-arr-ad">
                            <Typography className="arri-val-loc-ation">Time to say GoodBye to Kathmandu</Typography>
                        </Box>
                        <Box onClick={!myShow14==true?()=>setMyshow14(true):()=>setMyshow14(false)}>
                           <BiChevronDown className="bi-che-vron-ad-de" />
                        </Box>
                        </Box>
                        {
                            myShow14==true?
                               <Box>
                                <Typography className="hidden-text">Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer.Lorem Ipsum is simply du my text of the pritin industry. Lorm Ipsum hasbeen the industry's 
                                   standardsdummy text eversince the 1500s, 
                                   when an unknown printer</Typography>
                                </Box>:null
                           }
                    </Box>
                </Box>
            </Card>
        </Box>
    )
}

export default Itenary;