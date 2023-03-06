import './App.css';
import {Button, MenuItem, Select} from "@mui/material";
import {useState} from "react";
import {useQuery} from "react-query";
import {create} from "apisauce";

function App() {
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedRoles, setSelectedRoles] = useState([])

  const api = create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  const {isLoading: isUsersLoading, error: isUsersError, data: usersData} = useQuery('users', () =>
      fetch('http://127.0.0.1:8000/permissions/users').then(res =>
          res.json()
      )
  )
  const {isLoading: isRolesLoading, error: isRolesError, data: rolesData} = useQuery('roles', () =>
      fetch('http://127.0.0.1:8000/permissions/roles').then(res =>
          res.json()
      )
  )

  const saveUserRole = async () => {
    await api.post("/permissions/", {
      user: {
        "name": selectedUser
      },
      "roles": selectedRoles
    })
  }

  const handleClick = async () => {
    try {
      await saveUserRole(setSelectedUser, selectedRoles);
    } catch {
      console.log("Error")
    } finally {
      setSelectedUser("")
      setSelectedRoles([])
    }
  }

  return (<>{isRolesError || isRolesLoading || isUsersError || isUsersLoading ? (<div>Loading</div>) : (
          <div className="App" style={{display: "flex", flexDirection: "column", width: "30%", gap: "20px"}}>
            <p>Select User</p>
            <Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>{
              usersData.data.map((user) => {
                return (<MenuItem key={user.name} value={user.name}>{user.name}</MenuItem>)
              })
            }
            </Select>
            <p>Select Roles to add</p>
            <Select
                multiple
                value={selectedRoles}
                onChange={(e) => setSelectedRoles(e.target.value)}
            >
              {rolesData.data.map((role) => (
                  <MenuItem
                      key={role}
                      value={role.id}
                  >
                    {role.role}
                  </MenuItem>
              ))}
            </Select>
            <Button onClick={handleClick}>Save Changes</Button>
          </div>)

      }</>
  )

}

export default App;
