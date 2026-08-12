export default function AboutPage() {
  return (
    <section>
      <div className="page-heading">
        <h2>About</h2>

        <p>
          Learn more about the Phoneme Activity Builder and the purpose of this
          frontend application.
        </p>
      </div>

      <div className="builderLayout">
        <section className="builderCard">
          <h3>Project Overview</h3>

          <p className="mutedText">
            The Phoneme Activity Builder is designed to help create interactive
            phoneme based classroom activities for Speech Pathology learning.
          </p>

          <p className="mutedText">
            Teachers can configure Wordle and Word Search activities, preview
            how each activity behaves, and generate a standalone HTML file that
            can be opened directly in a web browser.
          </p>
        </section>

        <section className="builderCard">
          <h3>Student Details</h3>

          <p>
            <strong>Name:</strong> Emmanuel Sholola
          </p>

          <p>
            <strong>Student ID:</strong> 22338567
          </p>
        </section>

        <section className="builderCard">
          <h3>Instructional Video</h3>

          <p className="mutedText">
            A short walkthrough demonstrating the application and its key
            frontend features will be provided here.
          </p>
        </section>
      </div>
    </section>
  );
}