import React, { useEffect, useContext, useMemo, useCallback } from 'react';
import DataTable from 'react-data-table-component';
import Moment from 'react-moment';
import { Modal, Button, Image, Header, Divider, Label } from 'semantic-ui-react';

import UserAppsContext from '../../../context/userapps/userAppsContext';

import Loader from '../../layouts/loader/Loader';

const ExpandedData = ({ data }) => (
    <div>
        <p><Moment unix format="LLLL">{data.created_at}</Moment></p>
        <Divider hidden />
        <Image src={data.userAppQuiz.image} size="small" />
    </div>
);

const UserApps = () => {
    const userAppsContext = useContext(UserAppsContext);
    const { user_apps, getAllUserApps, updateUserApps, setLoading } = userAppsContext;

    useEffect(() => {
        getAllUserApps();
        // eslint-disable-next-line
    },[])

    const onUserApprove = useCallback((status, id, user_id) => {
        updateUserApps(status, id, user_id);
    }, [status, id, user_id]);

    const onUserDeny = useCallback((status, id, user_id) => {
        updateUserApps(status, id, user_id);
    }, [status, id, user_id]);

    const columns = useMemo(() => [
        {
            name: 'User',
            sortable: true,
            cell: row => <div>{row.userAppUser && row.userAppUser.name}</div>
        },
        {
            name: 'Score',
            selector: 'score',
            sortable: true
        },
        {
            name: 'Application',
            cell: row => <div>
                            <Modal trigger={<Button size="small">View</Button>}>
                                <Modal.Header>{row.userAppUser && row.userAppUser.name}'s Application</Modal.Header>
                                <Modal.Content image>
                                    <Image wrapped size="huge" src={row.userAppQuiz && row.userAppQuiz.image} />
                                    <Modal.Description>
                                        <Header>{row.userAppQuiz && row.userAppQuiz.title}</Header>
                                        <p style={{ textAlign: 'justify' }}>
                                            {row.userAppQuiz && row.userAppQuiz.question}
                                        </p>
                                        <Divider />
                                        <Header as="h3">The Answer</Header>
                                        <p style={{ textAlign: 'justify' }}>
                                            {row.answer}
                                        </p>
                                    </Modal.Description>
                                </Modal.Content>
                            </Modal>
                        </div>
        },
        {
            name: 'Status',
            sortable: true,
            cell: row => <div>{row.userAppUser && row.userAppUser.status === 1 ? (<Label color="yellow">Pending</Label>) : 
                row.userAppUser && row.userAppUser.status === 2 ? (<Label color="red">Denied</Label>) : (<Label color="green">Approved</Label>)}</div>
        },
        {
            name: 'Approved by',
            cell: row => <div>{row.admin_id ? row.userAppAdmin && row.userAppAdmin.name : 'Nobody'}</div>
        },
        {
            name: 'Created at',
            selector: 'created_at',
            sortable: true,
            cell: row => <div><Moment unix format="ll">{row.created_at}</Moment></div>
        },
        {
            name: 'Updated at',
            selector: 'updated_at',
            sortable: true,
            cell: row => <div>{row.updated_at !== null ? (<Moment unix format="ll">{row.created_at}</Moment>) : 'No update'}</div>
        },
        {
            name: 'Action',
            sortable: false,
            button: true,
            cell: (row) => (
                <Button.Group size="small">
                    {row.userAppUser && row.userAppUser.status === 1 && (<div>
                        <Button
                            icon="checkmark"
                            color="green"
                            onClick={() => onUserApprove(1, row.id, row.user_id)}
                        />
                        <Button
                            icon="delete"
                            color="red"
                            onClick={() => onUserDeny(0, row.id, row.user_id)}
                        />
                    </div>)}
                </Button.Group> 
            )
        }
    ], [onUserApprove, onUserDeny]);

    return (
        <>
            {user_apps !== null && user_apps.length === 0 && !setLoading && (
                <Image src="https://media.giphy.com/media/giXLnhxp60zEEIkq8K/giphy-downsized.gif" centered />
            )}
            {user_apps !== null && !setLoading ? (
                <DataTable
                    title="User Applications"
                    columns={columns}
                    data={user_apps}
                    pagination
                    expandableRows
                    expandableRowsComponent={<ExpandedData />}
                    highlightOnHover
                    defaultSortField="created_at"
                />
            ) : (
                <Loader isLoading={setLoading} />
            )}
        </>
    )
}

export default UserApps;
