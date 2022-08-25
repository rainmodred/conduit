import CreateArticleForm from '../components/CreateArticleForm/CreateArticleForm';

export default function Editor() {
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <CreateArticleForm />
          </div>
        </div>
      </div>
    </div>
  );
}
