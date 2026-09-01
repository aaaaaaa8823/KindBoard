ALTER TABLE recognitions
DROP
CONSTRAINT fk_recognitions_on_quality;

ALTER TABLE recognitions
    ADD receiver_id BIGINT;

ALTER TABLE recognitions
    ALTER COLUMN receiver_id SET NOT NULL;

ALTER TABLE recognitions
    ADD CONSTRAINT FK_RECOGNITIONS_ON_RECEIVER FOREIGN KEY (receiver_id) REFERENCES users (id);