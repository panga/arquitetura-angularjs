(function (undefined) {
    angular.module('rails').factory('RailsResourceSnapshotsMixin', ['RailsResourceInjector', function (RailsResourceInjector) {
        function RailsResourceSnapshotsMixin() {
        }

        RailsResourceSnapshotsMixin.configure = function (resourceConfig, newConfig) {
            resourceConfig.snapshotSerializer = RailsResourceInjector.getService(newConfig.snapshotSerializer);
        };

        RailsResourceSnapshotsMixin.extended = function (Resource) {
            Resource.intercept('afterResponse', function (result, resource, context) {
                if (context && context.hasOwnProperty('$snapshots') && angular.isArray(context.$snapshots)) {
                    context.$snapshots.length = 0;
                }
            });

            Resource.include({
                snapshot: snapshot,
                rollback: rollback,
                rollbackTo: rollbackTo,
                unsnappedChanges: unsnappedChanges,
                _prepSnapshot: _prepSnapshot
            });
        };

        return RailsResourceSnapshotsMixin;

        /**
         * Prepares a copy of the resource to be stored as a snapshot
         * @returns {Resource} the copied resource, sans $snapshots
         */
        function _prepSnapshot() {
            var config = this.constructor.config,
                copy = (config.snapshotSerializer || config.serializer).serialize(this);

            // we don't want to store our snapshots in the snapshots because that would make the rollback kind of funny
            // not to mention using more memory for each snapshot.
            delete copy.$snapshots;

            return copy
        }

        /**
         * Stores a copy of this resource in the $snapshots array to allow undoing changes.
         * @param {function} rollbackCallback Optional callback function to be executed after the rollback.
         * @returns {Number} The version of the snapshot created (0-based index)
         */
        function snapshot(rollbackCallback) {
            var copy = this._prepSnapshot();

            copy.$rollbackCallback = rollbackCallback;

            if (!this.$snapshots) {
                this.$snapshots = [];
            }

            this.$snapshots.push(copy);
            return this.$snapshots.length - 1;
        }

        /**
         * Rolls back the resource to a specific snapshot version (0-based index).
         * All versions after the specified version are removed from the snapshots list.
         *
         * If the version specified is greater than the number of versions then the last snapshot version
         * will be used.  If the version is less than 0 then the resource will be rolled back to the first version.
         *
         * If no snapshots are available then the operation will return false.
         *
         * If a rollback callback function was defined then it will be called after the rollback has been completed
         * with "this" assigned to the resource instance.
         *
         * @param {Number|undefined} version The version to roll back to.
         * @returns {Boolean} true if rollback was successful, false otherwise
         */
        function rollbackTo(version) {
            var versions, rollbackCallback,
                config = this.constructor.config,
                snapshots = this.$snapshots,
                snapshotsLength = this.$snapshots ? this.$snapshots.length : 0;

            // if an invalid snapshot version was specified then don't attempt to do anything
            if (!angular.isArray(snapshots) || snapshotsLength === 0 || !angular.isNumber(version)) {
                return false;
            }

            versions = snapshots.splice(Math.max(0, Math.min(version, snapshotsLength - 1)));

            if (!angular.isArray(versions) || versions.length === 0) {
                return false;
            }

            rollbackCallback = versions[0].$rollbackCallback;
            angular.extend(this, (config.snapshotSerializer || config.serializer).deserialize(versions[0]));

            // restore special variables
            this.$snapshots = snapshots;
            delete this.$rollbackCallback;

            if (angular.isFunction(rollbackCallback)) {
                rollbackCallback.call(this);
            }

            return true;
        }

        /**
         * Rolls back the resource to a previous snapshot.
         *
         * When numVersions is undefined or 0 then a single version is rolled back.
         * When numVersions exceeds the stored number of snapshots then the resource is rolled back to the first snapshot version.
         * When numVersions is less than 0 then the resource is rolled back to the first snapshot version.
         *
         * @param {Number|undefined} numVersions The number of versions to roll back to.  If undefined then
         * @returns {Boolean} true if rollback was successful, false otherwise
         */
        function rollback(numVersions) {
            var snapshotsLength = this.$snapshots ? this.$snapshots.length : 0;
            numVersions = Math.min(numVersions || 1, snapshotsLength);

            if (numVersions < 0) {
                numVersions = snapshotsLength;
            }

            if (snapshotsLength) {
                this.rollbackTo(this.$snapshots.length - numVersions);
            }

            return true;
        }

        /**
         * Checks if resource is changed from the most recent snapshot.
         * @returns {Boolean} true if the latest snapshot differs from resource as-is
         */
        function unsnappedChanges() {
            if (!this.$snapshots) {
                return true
            }

            var copy = this._prepSnapshot(),
                latestSnap = this.$snapshots[this.$snapshots.length - 1]

            return !angular.equals(copy, latestSnap)
        }

    }]);
}());