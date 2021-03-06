import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form, withFormik } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    Grid,
    Link,
    TextField,
    Typography,
    withStyles,
} from '@material-ui/core';

import * as NavigationUtils from '../../../utils/Navigation';
import * as UrlUtils from '../../../utils/URL';
import { Auth as AuthLayout } from '../../layouts';

class PasswordRequest extends Component {
    state = {
        loading: false,
        email: '',
        message: {},
    };

    /**
     * Event listener that is triggered when the password request form is submitted.
     *
     * @param {object} event
     *
     * @return {undefined}
     */
    handleRequestPasswordSubmit = async (values, { setSubmitting }) => {
        setSubmitting(false);

        try {
            this.setState({ loading: true });

            const { history } = this.props;
            const { email } = values;
            const routeSuffix = NavigationUtils._route('auth.passwords.reset');

            const response = await axios.post('api/v1/auth/password/request', {
                email,
                routeSuffix,
            });

            this.setState({
                loading: false,
                message: {
                    type: 'success',
                    title: 'Link Sent',
                    body: (
                        <Typography>
                            Check your email to reset your account.
                            <br /> Thank you.
                        </Typography>
                    ),
                    action: () => history.push(`/signin?username=${email}`),
                },
            });
        } catch (error) {
            if (!error.response) {
                this.setState({
                    loading: false,
                    message: {
                        type: 'error',
                        title: 'Something went wrong',
                        body: (
                            <Typography>
                                Oops? Something went wrong here.
                                <br /> Please try again.
                            </Typography>
                        ),
                        action: () => window.location.reload(),
                    },
                });

                return;
            }

            const { errors } = error.response.data;
            const { setErrors } = this.props;

            setErrors(errors);

            this.setState({ loading: false });
        }
    };

    componentDidMount() {
        const { location } = this.props;

        this.setState({
            email: UrlUtils._queryParams(location.search).hasOwnProperty(
                'username',
            )
                ? UrlUtils._queryParams(location.search).username
                : '',
        });
    }

    render() {
        const { classes, location } = this.props;
        const { loading, message, email } = this.state;

        return (
            <AuthLayout
                {...this.props}
                title={Lang.get('navigation.password_request_title')}
                subTitle={Lang.get('navigation.password_request_subtitle')}
                loading={loading}
                message={message}
            >
                <Formik
                    initialValues={{
                        email: !email
                            ? UrlUtils._queryParams(location.search).username
                            : email,
                    }}
                    onSubmit={this.handleRequestPasswordSubmit}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().required(
                            Lang.get('validation.required', {
                                attribute: 'email',
                            }),
                        ),
                    })}
                >
                    {({ values, handleChange, errors, isSubmitting }) => (
                        <Form>
                            <Grid container direction="column">
                                <Grid item className={classes.formGroup}>
                                    <TextField
                                        id="email"
                                        type="email"
                                        label="Email"
                                        value={values.email}
                                        onChange={handleChange}
                                        variant="outlined"
                                        fullWidth
                                        error={errors.hasOwnProperty('email')}
                                        helperText={
                                            errors.hasOwnProperty('email') &&
                                            errors.email
                                        }
                                    />
                                </Grid>

                                <Grid item className={classes.formGroup}>
                                    <Link
                                        component={props => (
                                            <RouterLink
                                                {...props}
                                                to={{
                                                    search: UrlUtils._queryString(
                                                        {
                                                            username: email,
                                                        },
                                                    ),
                                                    pathname: NavigationUtils._route(
                                                        'auth.signin',
                                                    ),
                                                }}
                                            />
                                        )}
                                    >
                                        {Lang.get('navigation.signin')}
                                    </Link>
                                </Grid>
                            </Grid>

                            <Grid container justify="space-between">
                                <Grid item />

                                <Grid item className={classes.formGroup}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={
                                            (errors &&
                                                Object.keys(errors).length >
                                                    0) ||
                                            isSubmitting
                                        }
                                    >
                                        {Lang.get('navigation.send_link')}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </AuthLayout>
        );
    }
}

const styles = theme => ({
    formGroup: {
        padding: theme.spacing.unit * 2,
        paddingTop: 0,
    },
});

const Styled = withStyles(styles)(PasswordRequest);

export default withFormik({})(Styled);
