import FieldInfo from "../../../../src/models/fieldInfo";
import Filter from "../../../../src/models/request/filter";
import sqlBuilderObjectMother from "../../../utils/objectMothers/domain/queries/sqlBuilderObjectMother";
import fieldInfoObjectMother from "../../../utils/objectMothers/models/fieldInfoObjectMother";
import fieldObjectMother from "../../../utils/objectMothers/models/fieldObjectMother"
import filterObjectMother from "../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../utils/objectMothers/models/selectorObjectMother";

describe('sqlBuilder tests', () => {
    const genderField = fieldObjectMother.get('gender');
    const addressCityField = fieldObjectMother.get('address.city');

    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female');
    const stringFieldInfo = fieldInfoObjectMother.get('string');

    const patientSelector = selectorObjectMother.get('Patient', [genderField, addressCityField], [femaleGenderFilter]);

    describe('build tests', () => {
        it('with count * select and resource from, corresponding sql is built', () => {
            // ARRANGE
            const filterTypes = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);

            const builder = sqlBuilderObjectMother.get()
                .select()
                .countAll()
                .from()
                .resourceTable();

            // ACT
            const sql = builder.build(patientSelector, filterTypes);

            // ASSERT
            expect(sql).toEqual("SELECT count(*) FROM Patient patient_table")
        })

        it('with where clause, filter is used for where portion', () => {
            // ARRANGE
            const filterTypes = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);

            const builder = sqlBuilderObjectMother.get()
                .select()
                .countAll()
                .from()
                .resourceTable()
                .where()
                .fieldFilter();

            // ACT
            const sql = builder.build(patientSelector, filterTypes);

            // ASSERT
            expect(sql).toEqual("SELECT count(*) FROM Patient patient_table WHERE resource->>'gender' = 'female'")
        })
    })

    function getFieldsMap(fields: Filter[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Filter, FieldInfo>();

        for (var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fieldsMap.set(fields[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }
})