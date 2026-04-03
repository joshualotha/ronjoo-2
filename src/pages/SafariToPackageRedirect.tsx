import { Navigate, useParams } from "react-router-dom";

/** Reference site uses `/safaris/:slug` for the main safari marketing page. */
const SafariToPackageRedirect = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/safaris/${id ?? ""}`} replace />;
};

export default SafariToPackageRedirect;
