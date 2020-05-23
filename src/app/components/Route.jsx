import React from "react";
import { Route as DomRoute } from "react-router-dom";
import { Redirect } from "react-router";
import { connect } from "react-redux";

const WrappedRoute = ({
  component: Component,
  isPublic,
  isAuthenticated,
  ...rest
}) => {
  return (
    <DomRoute
      {...rest}
      render={(routeProps) => {
        console.log("AUUTHTHTT++=====", isAuthenticated);
        if (isPublic) {
          return <Component {...routeProps} />;
        } else if (isAuthenticated) {
          return <Component {...routeProps} />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />
  );
};

const mapStateToProps = ({ session }, props) => ({
  ...props,
  Component: props.component,
  isAuthenticated: !!session.authenticated,
});

export const Route = connect(mapStateToProps)(WrappedRoute);
