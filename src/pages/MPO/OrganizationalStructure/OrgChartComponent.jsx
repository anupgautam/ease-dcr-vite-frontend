import React, { useEffect, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { useGetUsersByHigherLevelUserQuery } from '@/api/MPOSlices/UserSlice';
import styled from 'styled-components';
import { useSelector } from 'react-redux';


const StyledNode = styled.div`
  padding: 8px;
  border-radius: 8px;
  display: inline-block;
  background-color:#2e8960;
  color:white;
  padding-left:10px;
  padding-right:10px;
`;

export const OrgChartComponent = () => {
  const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

  const data = useGetUsersByHigherLevelUserQuery(company_id);
  const [allData, setAllData] = useState();


  useEffect(() => {
    if (data?.data) {
      setAllData(data?.data[0]);
    }
  }, [data])
  return (
    <Tree
      lineWidth={'3px'}
      lineColor={'#2e8960'}
      lineBorderRadius={'10px'}
      lineHeight={"40px"}
      label={<StyledNode>
        <div style={{ padding: '5px', paddingLeft: '12px', paddingRight: '12px' }}>
          <h2 style={{ fontSize: '18px', color: "white" }}>{allData?.user_name?.first_name + ' ' + allData?.user_name?.middle_name + ' ' + allData?.user_name?.last_name}</h2>
          <p style={{ fontSize: '15px', color: "white" }}>{allData?.role_name.role_name_value}</p>
        </div>
      </StyledNode>}
    >
      <LowerLevel id={allData?.user_name?.id} />
      {/* <TreeNode label={<StyledNode>Child 1</StyledNode>}>
        <TreeNode label={<StyledNode>Grand Child</StyledNode>} />
      </TreeNode>
      <TreeNode label={<StyledNode>Child 2</StyledNode>}>
        <TreeNode label={<StyledNode>Grand Child</StyledNode>}>
          <TreeNode label={<StyledNode>Great Grand Child 1</StyledNode>} />
          <TreeNode label={<StyledNode>Great Grand Child 2</StyledNode>} />
        </TreeNode>
      </TreeNode>
      <TreeNode label={<StyledNode>Child 3</StyledNode>}>
        <TreeNode label={<StyledNode>Grand Child 1</StyledNode>} />
        <TreeNode label={<StyledNode>Grand Child 2</StyledNode>} />
      </TreeNode> */}
    </Tree>
  );
};

const LowerLevel = ({ id }) => {
  const { data } = useGetUsersByHigherLevelUserQuery(id);

  return (
    <>
      {
        data !== undefined ?
          <>
            {
              data.map((key, index) => (
                <TreeNode key={index} label={<StyledNode>
                  <div style={{ padding: '5px', paddingLeft: '12px', paddingRight: '12px' }}>
                    <h2 style={{ fontSize: '18px', color: "white" }}>{key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name}</h2>
                    <p style={{ fontSize: '15px', color: "white" }}>{key.role_name.role_name_value}</p>
                  </div>
                </StyledNode>}>
                  <LowerLevel1 id={key.id} />
                </TreeNode>
              ))
            }
          </> : null
      }
    </>
  )
}

const LowerLevel1 = ({ id }) => {
  const { data } = useGetUsersByHigherLevelUserQuery(id);
  return (
    <>
      {
        data !== undefined ?
          <>
            {
              data.map((key, index) => (
                <TreeNode key={index} label={<StyledNode>
                  <div style={{ padding: '5px', paddingLeft: '12px', paddingRight: '12px' }}>
                    <h2 style={{ fontSize: '18px', color: "white" }}>{key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name}</h2>
                    <p style={{ fontSize: '15px', color: "white" }}>{key.role_name.role_name_value}</p>
                  </div>
                </StyledNode>}>
                  <LowerLevel2 id={key.id} />
                </TreeNode>
              ))
            }
          </> : null
      }
    </>
  )
}

const LowerLevel2 = ({ id }) => {
  const { data } = useGetUsersByHigherLevelUserQuery(id);
  return (
    <>
      {
        data !== undefined ?
          <>
            {
              data.map((key, index) => (
                <TreeNode key={index} label={<StyledNode>
                  <div style={{ padding: '5px', paddingLeft: '12px', paddingRight: '12px' }}>
                    <h2 style={{ fontSize: '18px', color: "white" }}>{key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name}</h2>
                    <p style={{ fontSize: '15px', color: "white" }}>{key.role_name.role_name_value}</p>
                  </div>
                </StyledNode>}>
                  <LowerLevel3 id={key.id} />
                </TreeNode>
              ))
            }
          </> : null
      }
    </>
  )
}

const LowerLevel3 = ({ id }) => {
  const { data } = useGetUsersByHigherLevelUserQuery(id);
  return (
    <>
      {
        data !== undefined ?
          <>
            {
              data.map((key, index) => (
                <TreeNode key={index} label={<StyledNode>
                  <div style={{ padding: '5px', paddingLeft: '12px', paddingRight: '12px' }}>
                    <h2 style={{ fontSize: '18px', color: "white" }}>{key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name}</h2>
                    <p style={{ fontSize: '15px', color: "white" }}>{key.role_name.role_name_value}</p>
                  </div>
                </StyledNode>}>
                  <LowerLevel4 id={key.id} />
                </TreeNode>
              ))
            }
          </> : null
      }
    </>
  )
}

const LowerLevel4 = ({ id }) => {
  const { data } = useGetUsersByHigherLevelUserQuery(id);
  return (
    <>
      {
        data !== undefined ?
          <>
            {
              data.map((key, index) => (
                <TreeNode key={index} label={<StyledNode>
                  <div style={{ padding: '5px', paddingLeft: '12px', paddingRight: '12px' }}>
                    <h2 style={{ fontSize: '18px', color: "white" }}>{key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name}</h2>
                    <p style={{ fontSize: '15px', color: "white" }}>{key.role_name.role_name_value}</p>
                  </div>
                </StyledNode>}>
                  <LowerLevel5 id={key.id} />
                </TreeNode>
              ))
            }
          </> : null
      }
    </>
  )
}

const LowerLevel5 = ({ id }) => {
  const { data } = useGetUsersByHigherLevelUserQuery(id);
  return (
    <>
      {
        data !== undefined ?
          <>
            {
              data.map((key, index) => (
                <TreeNode key={index} label={<StyledNode>
                  <div style={{ padding: '5px', paddingLeft: '12px', paddingRight: '12px' }}>
                    <h2 style={{ fontSize: '18px', color: "white" }}>{key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name}</h2>
                    <p style={{ fontSize: '15px', color: "white" }}>{key.role_name.role_name_value}</p>
                  </div>
                </StyledNode>}>
                  <LowerLevel6 id={key.id} />
                </TreeNode>
              ))
            }
          </> : null
      }
    </>
  )
}

const LowerLevel6 = ({ id }) => {
  const { data } = useGetUsersByHigherLevelUserQuery(id);
  return (
    <>
      {
        data !== undefined ?
          <>
            {
              data.map((key, index) => (
                <TreeNode key={index} label={<StyledNode>
                  <div style={{ padding: '5px', paddingLeft: '12px', paddingRight: '12px' }}>
                    <h2 style={{ fontSize: '18px', color: "white" }}>{key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name}</h2>
                    <p style={{ fontSize: '15px', color: "white" }}>{key.role_name.role_name_value}</p>
                  </div>
                </StyledNode>}>
                  {/* <LowerLevel5 id={key.id} /> */}
                </TreeNode>
              ))
            }
          </> : null
      }
    </>
  )
}