import React, { useState, useEffect } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [documents, setDocuments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !pdfFile) {
      alert("Please provide both email and PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('pdf_file', pdfFile);

    try {
      const response = await fetch('http://localhost:8000/api/documents/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
        return;
      }

      alert("PDF uploaded and processed successfully!");
      fetchDocuments();
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("An error occurred while uploading the PDF.");
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/documents/');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      } else {
        console.error("Failed to fetch documents.");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Upload PDF</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="pdfFile" className="form-label">PDF File</label>
                  <input
                    type="file"
                    id="pdfFile"
                    className="form-control"
                    accept="application/pdf"
                    onChange={e => setPdfFile(e.target.files[0])}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Upload
                </button>
              </form>
            </div>
          </div>

          <div className="card mt-5 shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Processed Documents</h2>
              {documents.length > 0 ? (
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Email</th>
                      <th>Nouns</th>
                      <th>Verbs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.email}>
                        <td>{doc.email}</td>
                        <td>{doc.nouns.join(', ')}</td>
                        <td>{doc.verbs.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">No documents processed yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
