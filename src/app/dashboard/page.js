'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, setPage } from '../redux/userSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Pagination, Box, Grid, Typography, Button } from '@mui/material';
import { Visibility, VisibilityOff, AddCircleOutline, Edit, Delete } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility'; 

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  const { data = [], page = 1, totalPages = 0, loading = false } = useSelector((state) => state.users || {});

  const [firstNameSearch, setFirstNameSearch] = useState('');
  const [lastNameSearch, setLastNameSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [sortOrder, setSortOrder] = useState({ key: '', order: '' });
  const [revealedEmails, setRevealedEmails] = useState({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    dispatch(fetchUsers(page));
  }, [dispatch, page]);

  const handleSort = (key) => {
    const order = sortOrder.key === key && sortOrder.order === 'asc' ? 'desc' : 'asc';
    setSortOrder({ key, order });
  };

  const toggleEmailVisibility = (id) => {
    setRevealedEmails((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const handleClear = () => {
    setFirstNameSearch('');
    setLastNameSearch('');
    setEmailSearch('');
    dispatch(fetchUsers(page));
  };

  const handleView = (id) => {
    alert(`View details for user ID: ${id}`);
  };

  const handleEdit = (id) => {
    alert(`Edit details for user ID: ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete user ID: ${id}`);
  };

  const filteredData = data.filter(
    (user) =>
      user.first_name.toLowerCase().startsWith('g') ||  
      user.last_name.toLowerCase().startsWith('w') 
  );
  
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortOrder.key) return 0;
    if (sortOrder.order === 'asc') return a[sortOrder.key].localeCompare(b[sortOrder.key]);
    return b[sortOrder.key].localeCompare(a[sortOrder.key]);
  });

  if (loading) {
    return <p data-testid="loading-indicator" style={styles.loadingText}>Loading...</p>;
  }

  return (
    <>
      <Header />
      <Box sx={styles.pageContainer}>
        <Box sx={styles.searchSection}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Search by First Name"
                variant="outlined"
                value={firstNameSearch}
                onChange={(e) => setFirstNameSearch(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Search by Last Name"
                variant="outlined"
                value={lastNameSearch}
                onChange={(e) => setLastNameSearch(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Search by Email"
                variant="outlined"
                value={emailSearch}
                onChange={(e) => setEmailSearch(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
            <Button onClick={handleClear} style={{ backgroundColor: '#23366f', color: '#fff', width:100 }}>
              Clear
            </Button>
          </Box>
        </Box>

        <Box sx={styles.tableSection}>
          <Box sx={styles.titleContainer}>
            <Typography sx={styles.pageTitle}>Customer Listing Page</Typography>
            <Button sx={styles.addButton}>
              <AddCircleOutline sx={styles.addIcon} />
            </Button>
          </Box>
          <TableContainer component={Paper} style={{ marginTop: 30 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell onClick={() => handleSort('first_name')} style={styles.tableHeader}>First Name</TableCell>
                  <TableCell onClick={() => handleSort('last_name')} style={styles.tableHeader}>Last Name</TableCell>
                  <TableCell onClick={() => handleSort('email')} style={styles.tableHeader}>Email</TableCell>
                  <TableCell style={styles.tableHeader}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell style={styles.tableCell}>{user.first_name}</TableCell>
                    <TableCell style={styles.tableCell}>{user.last_name}</TableCell>
                    <TableCell style={styles.tableCell}>
                      {revealedEmails[user.id]
                        ? user.email
                        : '********@****.com'}
                      <IconButton
                        size="small"
                        onClick={() => toggleEmailVisibility(user.id)}
                        data-testid="VisibilityIcon"  
                        sx={styles.revealButton}
                      >
                        {revealedEmails[user.id] ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      <IconButton
                        size="small"
                        onClick={() => handleView(user.id)}
                        sx={styles.actionIcon}  
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(user.id)}
                        sx={styles.editIcon} 
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(user.id)}
                        sx={styles.deleteIcon} 
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={styles.pagination}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => dispatch(setPage(value))}
              color="primary"
            />
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

const styles = {
  pageContainer: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',  
    marginBottom: '20px',
  },
  pageTitle: {
    fontSize: '1.2rem',
    fontWeight:'bold',
    textAlign: 'left',  
    color: '#23366f',
  },
  addButton:{
    width:30, 
    height:30,
    backgroundColor:"#23366f",
  },
  addIcon: {
    fontSize: '1.5rem',
    color: '#fff',
    cursor: 'pointer',
  },
  searchSection: {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  tableSection: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  tableHeader: {
    cursor: 'pointer',
    fontWeight: 'bold',
    textAlign:'center',
    width: '25%', 
    backgroundColor: '#23366f',
    color: '#fff',
  },
  tableCell: {
    cursor: 'pointer',
    fontWeight: 'normal',
    textAlign:'center',
    width: '25%', 
  },
  revealButton: {
    marginLeft: '30px',
  },
  pagination: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#888',
    marginTop: '100px',
  },
  actionIcon: {
    marginLeft: '10px',
    color: '#23366f', 
  },
  editIcon: {
    marginLeft: '10px',
    color: 'green', 
  },
  deleteIcon: {
    marginLeft: '10px',
    color: 'red', 
  },
};
