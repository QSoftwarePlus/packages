import { Treatment, TreatmentUserHistoryHeader, TreatmentUserHistoryItems } from 'database';
import { TestApp } from 'test/test-app';

export const treatmentUserHistoryFactory = async ({
    app,
    override,
    treatment,
}: {
    app: TestApp;
    treatment: Pick<Treatment, 'id'>
    override?: {
        header: Partial<Pick<TreatmentUserHistoryHeader, 'createdAt' | 'deleted_at' | 'type' | 'updatedAt'>>
    }
}) => {
    const treatmentUserHistory = await app.getDatabase().treatmentUserHistoryHeader.create({
        data: {
            treatment: {
                connect: {
                    id: treatment.id,
                },
            },
            type: 'taking_drops',
            ...override?.header,
        },
    });

    const addItem = ({ item }: {
        item: Partial<Pick<TreatmentUserHistoryItems, 'unit_of_measurement' | 'createdAt' | 'deleted_at' | 'notes' | 'value' | 'updatedAt'>>
    }) => {
        return app.getDatabase().treatmentUserHistoryItems.create({
            data: {
                treatment_user_history_header_id: treatmentUserHistory.id,
                unit_of_measurement: 'mg',
                value: 30,
                ...item
            },
            include: {
                moods: true,
                symptoms: true,
            },
        });
    }

    return {
        treatmentUserHistory,
        addItem,
    };
};