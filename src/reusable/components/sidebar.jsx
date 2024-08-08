import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableColumns, faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { faBriefcaseMedical } from "@fortawesome/free-solid-svg-icons";
import { faUser, faDollarSign, faBook, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Transition } from 'react-transition-group';

const transitionStyles = {
  entering: { display: `block`, opacity: `0.5`, transition: `display 500ms ease`, },
  entered: { display: `block`, opacity: `1`, transition: `display 500ms ease`, },
  exiting: { display: `block`, opacity: `0.5`, transition: `display 500ms ease`, },
  exited: { display: `none`, opacity: `0`, transition: `display 500ms ease`, },
};

const Sidebar = () => {
  const [NewColor, setNewColor] = useState({});
  const data = [{
    'items-name': 'user name',
    'sub-items':
      [{
        'sub-items-name': 'list of users',
        'sub-items-icon': faTableColumns
      },
      {
        'sub-items-name': 'edit users',
        'sub-items-icon': faBriefcaseMedical
      }
      ],
    'items-icon': faUser
  },
  {
    'items-name': 'company',
    'sub-items':
      [{
        'sub-items-name': 'list of companies',
        'sub-items-icon': faDollarSign
      },
      {
        'sub-items-name': 'edit companies',
        'sub-items-icon': faBook
      }
      ],
    'items-icon': faCircleQuestion
  },
  {
    'items-name': 'medicine',

    'items-icon': faCircleQuestion
  },
  {
    'items-name': 'chemist',
    'sub-items':
      [{
        'sub-items-name': 'list of chemist',
        'sub-items-icon': faTableColumns
      },
      {
        'sub-items-name': 'edit chemist',
        'sub-items-icon': faBriefcaseMedical
      }
      ],
    'items-icon': faUser
  },

  {
    'items-name': 'mpo',
    'sub-items':
      [{
        'sub-items-name': 'list of mpo',
        'sub-items-icon': faTableColumns
      },
      {
        'sub-items-name': 'edit mpo',
        'sub-items-icon': faBriefcaseMedical
      },
      {
        'sub-items-name': 'delete mpo',
        'sub-items-icon': faBriefcaseMedical
      }
      ],
    'items-icon': faUser
  }]

  const stateChange = (state, setState, data) => {
    data.forEach(element => {
      setState(state => ({
        ...state,
        [element['items-name']]: false
      }));
    });
  }

  useEffect(() => {
    stateChange(NewColor, setNewColor, data);
  }, [])

  const showDisplay = (e, key) => {
    e.preventDefault();
    if (NewColor[key]) {
      setNewColor(NewColor => ({
        ...NewColor,
        [key]: false
      }));
    }
    else {

      setNewColor(NewColor => ({
        ...NewColor,
        [key]: true
      }));

    }
  }
  return (
    <>
      <Box sx={{ height: 791, backgroundColor: '#283342' }}>
        <NavLink style={{ textDecoration: "None" }} to="/dashboard/home">
        </NavLink>
        <Box>
          <List>
            {data.map((key) => (
              <Box key={uuid()}>
                <ListItem
                  className={NewColor[key['items-name']] ? "side-bar-link-items" : "side-bar-link-items1"}
                  onClick={(e) => showDisplay(e, key['items-name'])}>
                  <Link to={`/dashboard/${key['items-name'].split(" ").join("-")}`}
                    className="dashboard-text">
                    <FontAwesomeIcon className="dashboard-icon"
                      icon={key['items-icon']} />{key['items-name']}
                  </Link>
                  {key['sub-items'] ? <>
                    {!NewColor[key['items-name']] ?
                      <FontAwesomeIcon className="drop-down-arrow-icon" icon={faAngleDown} /> :
                      <FontAwesomeIcon className="drop-down-arrow-icon" icon={faAngleUp} />}</> :
                    <></>}
                </ListItem>
                <Transition in={NewColor[key['items-name']]}
                  timeout={500}>
                  {state => (
                    <List key={uuid()}
                      className="my-product-list-border"
                      style={{
                        ...transitionStyles[state]
                      }}>
                      {key['sub-items'] ? <>
                        {key['sub-items'].map((key1) => (
                          <ListItem style={{ marginLeft: '10px' }}>
                            <Link to={`/dashboard/${key['items-name'].split(" ").join("-")}/${key1['sub-items-name'].split(" ").join("-")}`}
                              className="dashboard-text product-tab-bar">
                              <FontAwesomeIcon className="dashboard-icon"
                                icon={key1['sub-items-icon']} /> {key1['sub-items-name']}
                            </Link>
                          </ListItem>
                        ))}</> : <></>}
                    </List>
                  )}
                </Transition>
              </Box>
            ))}

          </List>
        </Box>
      </Box>
    </>
  );
}
export default Sidebar;
