
Parse.Cloud.define('hello', function(req, res) {
    res.success('111111111122222222222223333333333333');
});


//var _ = require("underscore");
//var Image = require("parse-image");
//var AUTOPLAY = "autoplay";
//var MAX_ANSWER_TIME = 15;
//var MAX_SCORE = 1000;
//var DEFAULT_READ_SPEED = 14; // letter per second (this value is random)
//var MAX_READ_SPEED = 21; // letter per second (this value is random)
//var DEFAULT_LUCK = 50; // luck : how quickly the user to remember the right answer, this value like percent (50%)
//var MAX_LUCK = 100; //this value like percent (100%)
//var DEFAULT_IQ = 50; // IQ : if the user knows the answer, this value like percent (50%)
//var MAX_IQ = 100; // this value like percent (100%)
//var MAX_PERCENTS = 100; // this value like percent (100%)
//var TIME_OUT_TEXT = "questionNotAnsweredInTime";
//var BONUS = 0;
//var BONUS_INCREMENT = 33.3; // each pass Quizling Increases IQ, luck, readSpeed user-bot 1/3
//var PRIVATE_USER = "private";
//
//
//Parse.Cloud.define("completedQuizling", function(request, response) {
//    Parse.Cloud.useMasterKey();
//    completedQuizling(request)
//        .then(
//        function(success) {
//            return response.success(success);
//        },
//        function(error) {
//            return response.error(error);
//        });
//});
//
//Parse.Cloud.afterSave("QuestionPersonalStatistics", function(request) {
//    Parse.Cloud.useMasterKey();
//
//    var answer = request.object.get("correctlyAnswered");
//    var questionId = request.object.get("question");
//
//    query = new Parse.Query("Question");
//
//    query.get(questionId.id, {
//        success : function(question) {
//            if (answer) {
//                if (question.get("correctAnswers") === undefined) {
//                    question.set("correctAnswers", 0);
//                }
//                question.increment("correctAnswers");
//            } else {
//                if (question.get("wrongAnswers") === undefined) {
//                    question.set("wrongAnswers", 0);
//                }
//                question.increment("wrongAnswers");
//            }
//            question.save();
//        },
//
//        error : function(error) {
//            console.error(error);
//        }
//    });
//});
//
//Parse.Cloud.define('chargeCard', function(req,res) {
//    var Stripe = require('stripe');
//    Stripe.initialize('sk_live_yrowO83jtcnUDCpjX1fLApuK');
//
//    var token = req.params.token;
//
//    var charge = Stripe.Charges.create({
//        amount: 1000, // amount in cents, again
//        currency: "aud",
//        source: token,
//        description: "Quizling access fee"
//    }).then(function(data){
//        res.success(data);
//    }, function(data) {
//        console.log(data);
//        res.error(data);
//    });
//});
//
//Parse.Cloud.beforeSave("Quizling", function(request, response) {
//    var quizling = request.object;
//    if (!quizling.get("image")) {
//        response.error("No image to resize.");
//        return;
//    }
//
//    if (!quizling.dirty("image")) {
//        // The quizling photo isn't being modified.
//        response.success();
//        return;
//    }
//
//    Parse.Cloud.httpRequest({
//        url: quizling.get("image").url()
//
//    }).then(function(response) {
//        var image = new Image();
//        return image.setData(response.buffer);
//
//    }).then(function(image) {
//        // Resize the image to 0.15
//        return image.scale({
//            width: image.width()*0.15,
//            height: image.height()*0.15
//        });
//
//    }).then(function(image) {
//        return image.setFormat("PNG");
//    }).then(function(image) {
//        // Get the image data in a Buffer.
//        return image.data();
//
//    }).then(function(buffer) {
//        // Save the image into a new file.
//        var base64 = buffer.toString("base64");
//        var image = new Parse.File("file.png", { base64: base64 });
//        return image.save();
//
//    }).then(function(image) {
//        // Attach the image file to the original object.
//        quizling.set("imageThumbnail", image);
//
//    }).then(function(result) {
//        response.success();
//    }, function(error) {
//        response.error(error);
//    });
//});
//
//Parse.Cloud.define("bot", function(request, response) {
//    Parse.Cloud.useMasterKey();
//    var userData = {};
//    getBUser()
//        .then(function(user) {
//            userData = user;
//            return Parse.Promise.as(userData);
//        })
//        .then(function(userData) {
//            return getNewQuizling()
//                .then(getQuestions)
//                .then(function(questions) {
//                    return prepareQuestionPersonalStatistics(questions, userData)
//                })
//                .then(function(response) {
//                    return completedQuizling(response.completedQuizling)
//                        .then(function(gameId) {
//                            return addNewQuestionPersonalStatistics(response.questionPersonalStatistics, gameId)
//                        });
//                })
//        })
//        .then(
//        function () {
//            return response.success("game completed");
//        },
//        function (error) {
//            return response.error(error.message);
//        });
//});
//
//Parse.Cloud.define("deleteQuizling", function(request, response) {
//    Parse.Cloud.useMasterKey();
//    var quizlingId = request.params.id;
//
//    var query = new Parse.Query("Quizling");
//    query.equalTo("objectId", quizlingId);
//    return query.first()
//        .then(function(quizling) {
//            if (quizling) {
//                return deleteQuizlingRalations(quizling)
//                    .then(function() {
//                        return quizling.destroy();
//                    });
//            } else {
//                return Parse.Promise.error("quizling not found")
//            }
//        })
//        .then(
//        function () {
//            return response.success("quizling was deleted");
//        },
//        function (error) {
//            return response.error(error);
//        });
//});
//
//Parse.Cloud.define("deleteQuizlingPiecemeal", function(request, response) {
//    Parse.Cloud.useMasterKey();
//    var quizlingId = request.params.id;
//
//    var query = new Parse.Query("Quizling");
//    query.equalTo("objectId", quizlingId);
//    return query.first()
//        .then(function(quizling) {
//            if (quizling) {
//                return deleteQuizlingPiecemeal(quizling)
//                    .then(function() {
//                        return quizling.destroy();
//                    });
//            } else {
//                return Parse.Promise.error("quizling not found")
//            }
//        })
//        .then(
//        function () {
//            return response.success("quizling was deleted");
//        },
//        function (error) {
//            return response.error(error);
//        });
//});
//
//// followings section _________________________________________________________
//
//// from old to new realization
//Parse.Cloud.beforeSave("Following", function(request, response) {
//    Parse.Cloud.useMasterKey();
//    var object = request.object;
//    var user = object.get("user");
//    var subscriber = object.get("subscriber");
//    var relationFollowings = subscriber.relation("followings");
//    relationFollowings.add(user);
//    var relationFollowers = user.relation("followers");
//    relationFollowers.add(subscriber);
//    subscriber.save()
//        .then(function () {
//            return user.save()
//        })
//        .then(function(result) {
//            response.success();
//        }, function(error) {
//            response.error(error);
//        });
//});
//
//// new
//Parse.Cloud.beforeDelete("Following", function(request, response) {
//    Parse.Cloud.useMasterKey();
//
//    var object = request.object;
//    var user = object.get("user");
//    var subscriber = object.get("subscriber");
//    var relationFollowings = subscriber.relation("followings");
//    relationFollowings.remove(user);
//    var relationFollowers = user.relation("followers");
//    relationFollowers.remove(subscriber);
//    subscriber.save()
//        .then(function () {
//            return user.save()
//        })
//        .then(function(result) {
//            response.success();
//        }, function(error) {
//            response.error(error);
//        });
//});
//
//// old
//Parse.Cloud.afterSave(Parse.User, function(request) {
//    Parse.Cloud.useMasterKey();
//    var user = request.object;
//    if (!user.existed()) {
//        if (user.get("type") == "org") { // todo: set const
//            return addFollowers(user) // old
//                .then(
//                function () {
//                    return response.success();
//                },
//                function (error) {
//                    return response.error(error);
//                });
//        }
//    }
//    return response.success();
//});
//
//// new
//Parse.Cloud.define("followUser", function(request, response) {
//    Parse.Cloud.useMasterKey();
//    if (!request.user) {
//        return response.error("user not found");
//    }
//    if (!request.params.followingId) {
//        return response.error("user to follow - not found");
//    }
//    getUserById(request.params.followingId)
//        .then(function(following) {
//            return assignFollowers([request.user], [following])
//                .then(function() {
//                    return assignFollowings([request.user], [following])
//                        .then(function() {
//                            return Parse.Promise.as("Now you follow " + following.get("username"));
//                        })
//                })
//        })
//        .then(
//        function (result) {
//            return response.success(result);
//        },
//        function (error) {
//            return response.error(error);
//        });
//});
//
//// new
//Parse.Cloud.define("unfollowUser", function(request, response) {
//    Parse.Cloud.useMasterKey();
//    if (!request.user) {
//        return response.error("user not found");
//    }
//    if (!request.params.followingId) {
//        return response.error("user to follow - not found");
//    }
//    getUserById(request.params.followingId)
//        .then(function(following) {
//            return unfollowUser(request.user, following)
//                .then(function() {
//                    return Parse.Promise.as("You no longer follow " + following.get("username"));
//                })
//        })
//        .then(
//        function (result) {
//            return response.success(result);
//        },
//        function (error) {
//            return response.error(error);
//        });
//});
//
//// new
//Parse.Cloud.define("removeFollower", function(request, response) {
//    Parse.Cloud.useMasterKey();
//    if (!request.user) {
//        return response.error("user not found");
//    }
//    if (!request.params.followerId) {
//        return response.error("user to remove - not found");
//    }
//    getUserById(request.params.followerId)
//        .then(function(follower) {
//            return unfollowUser(follower, request.user)
//                .then(function() {
//                    return Parse.Promise.as(follower.get("username") + " will no longer follow you");
//                })
//        })
//        .then(
//        function (result) {
//            return response.success(result);
//        },
//        function (error) {
//            return response.error(error);
//        });
//});
//
//// new
//// one-time run script
//Parse.Cloud.define("subscribeFollowings", function(request, response) {
//    Parse.Cloud.useMasterKey();
//    getOrgUsers()
//        .then(function(orgUsersObj) {
//            return getPrivateUsers()
//                .then(function(privateUsersObj) {
//                    return assignFollowings(orgUsersObj, privateUsersObj)
//                })
//        })
//        .then(
//        function (result) {
//            return response.success(result);
//        },
//        function (error) {
//            return response.error(error);
//        });
//});
//
//// new
//// one-time run script
//Parse.Cloud.define("subscribeFollowers", function(request, response) {
//    Parse.Cloud.useMasterKey();
//    getOrgUsers()
//        .then(function(orgUsersObj) {
//            return getPrivateUsers()
//                .then(function(privateUsersObj) {
//                    return assignFollowers(orgUsersObj, privateUsersObj)
//                })
//        })
//        .then(
//        function (result) {
//            return response.success(result);
//        },
//        function (error) {
//            return response.error(error);
//        });
//});
//
//// old
//// one-time run script
//Parse.Cloud.define("followOrgUsers", function(request, response) {
//    var userId = request.params.userId;
//    var _ = require("underscore.js");
//    var orgUser = new Parse.Query(Parse.User);
//    orgUser.equalTo("type", "org");
//    orgUser.equalTo("objectId", userId);
//    return orgUser.find()
//        .then(function(orgUsersObj) {
//            var promise = Parse.Promise.as();
//            _.each(orgUsersObj, function(orgUserObj) {
//                promise = promise.then(function() {
//                    var privateUser = new Parse.Query(Parse.User);
//                    privateUser.equalTo("type", "private");
//                    return findAll(privateUser)
//                        .then(function(privateUsersObj) {
//                            var promises = [];
//                            _.each(privateUsersObj, function(privateUserObj) {
//                                var Following = Parse.Object.extend("Following");
//                                var following = new Following();
//                                following.set("user", orgUserObj);
//                                following.set("subscriber", privateUserObj);
//                                promises.push(following.save());
//                            });
//                            return Parse.Promise.when(promises);
//                        });
//                });
//            });
//            return promise;
//        })
//        .then(
//        function (result) {
//            return response.success(result);
//        },
//        function (error) {
//            return response.error(error);
//        });
//});
//
//// following section end _________________________________________________________________
//
//
//// one-time run script
//Parse.Cloud.define("resetUserTypeToQuizlings", function(request, response) {
//    Parse.Cloud.useMasterKey();
//    var _ = require("underscore.js");
//    var query = new Parse.Query("Quizling");
//    query.equalTo("userType", undefined);
//    query.include("owner");
//    findAll(query)
//        .then(function(quizlings) {
//            var userType = "";
//            var promises = [];
//            _.each(quizlings, function(quizling) {
//                if(quizling.get("owner") && quizling.get("owner").get("type")) {
//                    userType = quizling.get("owner").get("type");
//                } else {
//                    userType = "deleted";
//                }
//                quizling.set("userType", userType);
//                promises.push(quizling.save());
//            });
//            return Parse.Promise.when(promises);
//        })
//        .then(
//        function (result) {
//            return response.success(result);
//        },
//        function (error) {
//            return response.error(error);
//        });
//});
//
//// one-time run script
//Parse.Cloud.define("setDefaultBestGame", function(request, response) {
//    var bestGame = new Parse.Query("Game");
//    bestGame.equalTo("best", undefined);
//    findAll(bestGame)
//        .then(function(games) {
//            if (games.length == 0) {
//                return Parse.Promise.as("all games was changed");
//            }
//            var promises = [];
//            _.each(games, function(game) {
//                game.set("best", false);
//                promises.push(game.save());
//            });
//            return Parse.Promise.when(promises);
//        })
//        .then(
//        function (result) {
//            return response.success(result);
//        },
//        function (error) {
//            return response.error(error);
//        });
//});
//
//// one-time run script
//Parse.Cloud.define("recountBestGames", function(request, response) {
//    var iterations = 1000;
//    setBestGames(iterations)
//        .then(
//        function () {
//            return response.success("games recounted");
//        },
//        function (error) {
//            return response.error(error.message);
//        });
//});
//
//Parse.Cloud.beforeSave("QuestionPersonalStatistics", function(request, response) {
//    Parse.Cloud.useMasterKey();
//    var obj = request.object;
//    var query = new Parse.Query("Quizling");
//    query.equalTo("objectId", obj.get("quizling").id);
//    return query.first()
//        .then(function(quizling) {
//            if (quizling && (quizling.get("quizlingOwner") != undefined) && (_.has(quizling, "owner"))) {
//                var owner = statistic.get("owner");
//                statistic.set("quizlingOwner", owner.id);
//                obj.set("quizlingOwner", owner.id);
//            }
//            return;
//        }).then(function() {
//            response.success();
//            return;
//        })
//});
//
//// one-time run script
//Parse.Cloud.define("addOwnerToQuestionPersonalStatistics", function(request, response) {
//    Parse.Cloud.useMasterKey();
//    var promises = [];
//    var owner;
//    var quizling;
//    var query = new Parse.Query("QuestionPersonalStatistics");
//    query.include("quizling");
//    query.equalTo("quizlingOwner", undefined);
//    query.limit(500);
//    query.find().then(
//        function (statistics) {
//            if (statistics.length == 0) {
//                return Parse.promise.as({message: "all statistics recounted"})
//            }
//            _.each(statistics, function(statistic) {
//                if (statistic.get("quizling") && statistic.get("quizling").get("owner")) {
//                    statistic.set("quizlingOwner", statistic.get("quizling").get("owner").id);
//                } else {
//                    statistic.set("quizlingOwner", "not found");
//                }
//                promises.push(statistic.save());
//            });
//            return Parse.Promise.when(promises);
//        },
//        function (error) {
//            return response.error(error.message);
//        })
//        .then(
//        function (success) {
//            return response.success(success.message || "end");
//        },
//        function (error) {
//            return response.error(error.message);
//        }
//    )
//});
//
//Parse.Cloud.define("addOwnerToGame", function(request, response) {
//    Parse.Cloud.useMasterKey();
//    var promises = [];
//    var owner;
//    var quizling;
//    var query = new Parse.Query("Game");
//    query.include("quizling");
//    query.equalTo("quizlingOwner", undefined);
//    query.limit(500);
//    query.find().then(
//        function (statistics) {
//            if (statistics.length == 0) {
//                return Parse.Promise.as({message: "all games recounted"})
//            }
//            _.each(statistics, function(statistic) {
//                if (statistic.get("quizling") && statistic.get("quizling").get("owner")) {
//                    statistic.set("quizlingOwner", statistic.get("quizling").get("owner").id);
//                } else {
//                    statistic.set("quizlingOwner", "not found");
//                }
//                promises.push(statistic.save());
//            });
//            return Parse.Promise.when(promises);
//        },
//        function (error) {
//            return response.error(error.message);
//        }).then(
//        function (success) {
//            return response.success(success.message || "end");
//        },
//        function (error) {
//            return response.error(error.message);
//        }
//    )
//});
//
////
////
////
////
////
//
//function setBestGames(iterations) {
//    var query = new Parse.Query("Game");
//    var best = {};
//    var promise = Parse.Promise.as();
//    for(var i = 0; i < iterations; i++) {
//        promise = promise.then(function() {
//            query.equalTo("best", undefined);
//            return query.first()
//                .then(function(game) {
//                    if (!game) {
//                        throw "all games was changed";
//                    }
//                    var query2 = new Parse.Query("Game");
//                    query2.equalTo("quizling", game.get("quizling"));
//                    query2.equalTo("user", game.get("user"));
//                    return findAll(query2)
//                        .then(function(uniques) {
//                            return checkGames(uniques)
//                                .then(function() {
//                                    best = uniques[0];
//                                    _.each(uniques, function(unique) {
//                                        if (unique.get("endScore") && (unique.get("endScore") > best.get("endScore"))) {
//                                            best = unique;
//                                        }
//                                    });
//                                    return saveHighScore(best)
//                                        .then(function() {
//                                            best.set("best", true);
//                                            return best.save();
//                                        })
//                                })
//                        })
//                })
//        });
//    }
//    return promise;
//}
//
//function saveHighScore(game) {
//    var HighScore = Parse.Object.extend("HighScore");
//    var highScore = new HighScore();
//    highScore.set("totalTime", game.get("totalTime"));
//    highScore.set("quizling", game.get("quizling"));
//    highScore.set("correctAnswers", game.get("correctAnswers"));
//    highScore.set("totalQuestions", game.get("totalQuestions"));
//    highScore.set("endScore", game.get("endScore"));
//    highScore.set("user", game.get("user"));
//    highScore.set("geolocation", game.get("geolocation"));
//    highScore.set("gameId", game.id);
//    return highScore.save()
//}
//
//function checkGames(uniques) {
//    var promises = [];
//    _.each(uniques, function(unique) {
//        unique.set("best", false);
//        promises.push(unique.save())
//    });
//    return Parse.Promise.when(promises)
//}
//
//function deleteQuizlingPiecemeal(quizling) {
//    var query = new Parse.Query("Question");
//    var questionIds = [];
//    query.equalTo("quizling", quizling);
//    return findAll(query)
//        .then(function(results) {
//            if(results.length > 0) {
//                var quizlingDelete = new Parse.Object("QuizlingDelete");
//                questionIds = {
//                    quizid: quizling.id,
//                    questionIds:_.pluck(results, 'id')
//                };
//                quizlingDelete.set("quizId", quizling.id);
//                quizlingDelete.set("questionIds", questionIds);
//                return quizlingDelete.save()
//                    .then(function() {
//                        return Parse.Object.destroyAll(results);
//                    })
//            }
//        });
//}
//
//function deleteQuizlingRalations(quizling) {
//    var promise = Parse.Promise.as();
//    var relationTables = {
//        DownloadedQuizling: "quizling",
//        SharedQuizling: "quizling",
//        Game: "quizling",
//        HighScore: "quizling",
//        QuestionPersonalStatistics: "quizling",
//        QuizPersonalStatistics: "quizling",
//        Question: "quizling"
//    };
//    _.each(relationTables, function(columnName, relationTable) {
//        promise = promise.then(function() {
//            var query = new Parse.Query(relationTable);
//            query.equalTo(columnName, quizling);
//            return findAll(query)
//                .then(function(results) {
//                    if(results.length > 0) {
//                        return Parse.Object.destroyAll(results);
//                    }
//                });
//        });
//    });
//    return promise;
//}
//
//function assignFollowings(followers, followings) {
//    var promise = Parse.Promise.as();
//    var promises = [];
//    _.each(followers, function(follower) {
//        promise = promise.then(function() {
//            _.each(followings, function(following) {
//                var relation = following.relation("followers");
//                promises.push(relation.add(follower));
//            });
//            return Parse.Promise.when(promises);
//        }).then(function() {
//            return Parse.Object.saveAll(followings);
//        })
//    });
//    return promise;
//}
//
//function assignFollowers(followers, followings) {
//    var promise = Parse.Promise.as();
//    var promises = [];
//    _.each(followings, function(following) {
//        promise = promise.then(function() {
//            _.each(followers, function(follower) {
//                var relation = follower.relation("followings");
//                promises.push(relation.add(following));
//            });
//            return Parse.Promise.when(promises);
//        }).then(function() {
//            return Parse.Object.saveAll(followers);
//        })
//    });
//    return promise;
//}
//
//function unfollowUser(follower, following) {
//    var relation1 = follower.relation("followings");
//    var relation2 = following.relation("followers");
//    relation1.remove(following);
//    relation2.remove(follower);
//    return following.save()
//        .then(function() {
//            return follower.save();
//        })
//}
//
//function getOrgUsers() {
//    var orgUsers = new Parse.Query(Parse.User);
//    orgUsers.equalTo("type", "org");
//    return findAll(orgUsers);
//}
//
//function getPrivateUsers() {
//    var privateUsers = new Parse.Query(Parse.User);
//    privateUsers.equalTo("type", "private");
//    return findAll(privateUsers);
//}
//
//function getQuizlingById(quizlingId) {
//    var query = new Parse.Query("Quizling");
//    query.equalTo("objectId", quizlingId);
//    return query.first();
//}
//
//function setQuizlingScore(request, object) {
//    var currentPlaycount = object.get("playCount");
//    if (currentPlaycount === undefined) {
//        currentPlaycount = 0;
//    }
//    var newPlayCount = currentPlaycount + 1;
//    var currentAverage = object.get("averageScore");
//    if (currentAverage === undefined) {
//        currentAverage = 0;
//    }
//    var newAverage = (currentAverage * currentPlaycount + request.params.correctAnswers) / newPlayCount;
//    object.set("averageScore", newAverage);
//    object.set("playCount", newPlayCount);
//    return object.save();
//}
//
///**
// *
// * @param request
// * @returns {*}
// */
//function completedQuizling(request) {
//    var quizlingId  = request.params.quizlingId;
//    var gameMode = request.params.gameMode;
//
//    return getQuizlingById(quizlingId)
//        .then(function(object) {
//            return setQuizlingScore(request, object)
//                .then(function(object) {
//                    return getHighScore(request.user, object)
//                        .then(function(highScoreObj) {
//
//                            if (highScoreObj && gameMode == AUTOPLAY) {
//                                if (highScoreObj.get("endScore") <= request.params.endScore) {
//                                    return destroyHighScore(highScoreObj)
//                                }
//                            }
//                            return Parse.Promise.as("");
//                        })
//                        .then(function() {
//                            return getBestGame(request.user, object)
//                                .then(function(bestGameObj) {
//                                    console.log({bestGame: !_.isEmpty(bestGameObj)});
//                                    if (!_.isEmpty(bestGameObj)) {
//                                        if (bestGameObj.get("endScore") <= request.params.endScore) {
//                                            return changeBestGame(bestGameObj)
//                                                .then(function() {
//                                                    return createGame(request, object, true);
//                                                })
//                                        } else {
//                                            return createGame(request, object, false);
//                                        }
//                                    } else {
//                                        return createGame(request, object, true);
//                                    }
//                                })
//                        })
//                })
//        })
//}
//
//function destroyHighScore(bestGameObj)
//{
//    return bestGameObj.destroy()
//}
//
//function changeBestGame(bestGameObj)
//{
//    bestGameObj.set("best", false);
//    return bestGameObj.save()
//}
//
//function getHighScore(user, object) {
//    var query = new Parse.Query("HighScore");
//    query.equalTo("quizling", object);
//    query.equalTo("user", user);
//    return query.first();
//}
//
//function getBestGame(user, object) {
//    var query = new Parse.Query("Game");
//    query.equalTo("quizling", object);
//    query.equalTo("user", user);
//    query.equalTo("best", true);
//    return query.first();
//}
//
//function getUserGameCount(user, object) {
//    var query = new Parse.Query("Game");
//    query.equalTo("quizling", object);
//    query.equalTo("user", user);
//    return query.count();
//}
//
//
//function createGame(request, object, best) {
//    var gameMode = request.params.gameMode;
//    var Game = Parse.Object.extend("Game");
//    var game = new Game();
//    game.set("totalTime", request.params.totalTime);
//    game.set("quizling", object);
//    game.set("quizlingOwner", object.get("owner").id);
//    game.set("correctAnswers", request.params.correctAnswers);
//    game.set("totalQuestions", request.params.totalQuestions);
//    game.set("endScore", request.params.endScore);
//    game.set("user", request.user);
//    game.set("best", best);
//    game.set("geolocation", request.params.geolocation);
//    return game.save()
//        .then(function() {
//            console.log({gameMode: gameMode});
//            if (best && gameMode == AUTOPLAY) {
//                console.log({gameMode: gameMode, best: best});
//                var HighScore = Parse.Object.extend("HighScore");
//                var highScore = new HighScore();
//                highScore.set("totalTime", request.params.totalTime);
//                highScore.set("quizling", object);
//                highScore.set("correctAnswers", request.params.correctAnswers);
//                highScore.set("totalQuestions", request.params.totalQuestions);
//                highScore.set("endScore", request.params.endScore);
//                highScore.set("user", request.user);
//                highScore.set("best", best);
//                highScore.set("geolocation", request.params.geolocation);
//                highScore.set("gameId", game.id);
//                return highScore.save()
//            }
//            return Parse.Promise.as("");
//        })
//        .then(function() {
//            var query2 = new Parse.Query("QuizPersonalStatistics");
//            var requestUser = request.user;
//            query2.equalTo("user", requestUser);
//            query2.equalTo("quizling", object);
//            return query2.find()
//                .then(function(results) {
//                    if (results.length > 0) {
//                        var stats = results[0];
//                        var currentPlaycount = stats.get("playCount");
//                        if (currentPlaycount === undefined) {
//                            currentPlaycount = 0;
//                        }
//                        var newPlayCount = currentPlaycount + 1;
//                        var currentAverage = stats.get("averageScore");
//                        if (currentAverage === undefined) {
//                            currentAverage = 0;
//                        }
//                        var newAverage = (currentAverage * currentPlaycount + request.params.correctAnswers) / newPlayCount;
//                        stats.set("averageScore", newAverage);
//                        stats.set("playCount", newPlayCount);
//                        return stats.save()
//                            .then(function() {
//                                return game.id
//                            })
//                    } else {
//                        var QuizPersonalStatistics = Parse.Object.extend("QuizPersonalStatistics");
//                        var stats = new QuizPersonalStatistics();
//                        stats.set("user", request.user);
//                        stats.set("quizling", object);
//                        stats.set("playCount", 1);
//                        stats.set("averageScore", request.params.correctAnswers);
//                        return stats.save()
//                            .then(function() {
//                                return game.id
//                            })
//                    }
//                })
//        })
//}
//
//function getUserById(userId) {
//    var query = new Parse.Query(Parse.User);
//    query.equalTo("objectId", userId);
//    return query.first();
//}
//
//function addFollowers(orgUserObj) {
//    return getPrivateUsers()
//        .then(function(privateUsersObj) {
//
//            // old realization
//            var promises = [];
//            _.each(privateUsersObj, function(privateUserObj) {
//                var Following = Parse.Object.extend("Following");
//                var following = new Following();
//                following.set("user", orgUserObj);
//                following.set("subscriber", privateUserObj);
//                promises.push(following.save());
//            });
//            return Parse.Promise.when(promises);
//
//            // new realization
//            //return assignFollowers([orgUserObj], privateUsersObj)
//            //    .then(function() {
//            //        return assignFollowings([orgUserObj], privateUsersObj)
//            //    })
//        })
//}
//
//function findAll(/*object*/query, /*array*/results, /*integer*/skip) {
//
//    if (!results) {
//        results = [];
//    }
//    if (!skip) {
//        skip = 0;
//    }
//    var parseLimit = 1000;
//    query.skip(skip);
//    query.limit(parseLimit);
//    return query.find()
//        .then(function (result) {
//            results = results.concat(result);
//            if (result.length == parseLimit) {
//                skip += parseLimit;
//                return findAll(query, results, skip);
//            }
//            return results;
//        });
//}
//
//function getNewQuizling() {
//    var BSettings = Parse.Object.extend("BSettings");
//    var query = new Parse.Query(BSettings);
//    return query.first()
//        .then(function(settings) {
//            var triggeringChance = (settings.get("triggeringChance") ? settings.get("triggeringChance") : settings.get("defaultTriggeringChance"));
//            if (Math.floor((MAX_PERCENTS * Math.random() + (MAX_PERCENTS - (MAX_PERCENTS - triggeringChance) ))) + 1 <= MAX_PERCENTS) {
//                var increaseTrigger = (Math.floor(triggeringChance / 2) + triggeringChance < MAX_PERCENTS ? Math.floor(triggeringChance / 2) : MAX_PERCENTS - triggeringChance);
//                settings.increment("triggeringChance", increaseTrigger);
//                return settings.save()
//                    .then(function() {
//                        return Parse.Promise.error({"message": "trigger not work, increase chance to " + (triggeringChance + increaseTrigger) + "%"});
//                    })
//            } else {
//                settings.set("triggeringChance", settings.get("defaultTriggeringChance"));
//                return settings.save()
//                    .then(function() {
//                        var Quizling = Parse.Object.extend("Quizling");
//                        var temporizingHours = settings.get("temporizingHours");
//                        var temporizingTime = new Date(new Date().setHours(new Date().getHours() - temporizingHours));
//                        var query = new Parse.Query("Quizling");
//                        query.greaterThan("createdAt", temporizingTime);
//                        query.equalTo("userType", PRIVATE_USER);
//                        return lib.findAll(query)
//                            .then(function(quizlings) {
//                                if (quizlings.length > 0) {
//                                    return _.first(_.shuffle(quizlings));
//                                } else {
//                                    return Parse.Promise.error({"message": "new quziling not found"});
//                                }
//                            })
//                    })
//            }
//        })
//}
//
//
//function getBUser() {
//    var BUser = Parse.Object.extend("BUser");
//    var bUser = new Parse.Query(BUser);
//    bUser.include("user");
//    return bUser.find()
//        .then(function(users) {
//            if (users.length == 0) {
//                return Parse.Promise.error({"message": "user not found"});
//            }
//            return Parse.Promise.as(users[Math.floor(Math.random() * users.length)])
//        })
//}
//
//function getAnsweredQuestion(questionId, questionStatistics) {
//    for(var i = 0; i < questionStatistics.length; i++) {
//        if (questionId == questionStatistics[i].get("question").id) {
//            return questionStatistics[i];
//        }
//    }
//}
//function prepareQuestionPersonalStatistics(questions, userData) {
//    var person = userData.get("user");
//    var quizling = {};
//    if (questions[0] && questions[0].get("quizling")) {
//        quizling = questions[0].get("quizling");
//    } else {
//        return Parse.Promise.error({"message": "No questions found"});
//    }
//    return manager.getUserGameCount(person, quizling)
//        .then(function(count) {
//            return manager.getBestGame(person, quizling)
//                .then(function(bestGame) {
//                    var replyGame = false;
//                    if (bestGame) {
//                        var query = new Parse.Query("QuestionPersonalStatistics");
//                        query.equalTo("game", bestGame);
//                        BONUS = count * BONUS_INCREMENT;
//                        return query.find()
//                            .then(function(questionStatistics) {
//                                if (questionStatistics.length !== questions.length) {
//                                    return Parse.Promise.error({"message": "an error in the statistics of the quiz"})
//                                }
//                                replyGame = true;
//                                return setStatistic(questions, userData, quizling, replyGame, questionStatistics);
//                            });
//                    } else {
//                        return setStatistic(questions, userData, quizling, replyGame);
//                    }
//                });
//        })
//}
//
//function setStatistic(questions, userData, quizling, replyGame, questionStatistics) {
//    var geolocation = getGeoPointExpression(userData);
//    var score = 0;
//    var totalTime = 0;
//    var correctAnswerCount = 0;
//    var person = userData.get("user");
//    var questionPersonalStatistics = [];
//    var totalQuestions = 0;
//    var correctlyAnswered = false;
//    _.each(questions, function(question) {
//        if (replyGame) {
//            var answeredQuestion = getAnsweredQuestion(question.id, questionStatistics);
//            correctlyAnswered = answeredQuestion.get("correctlyAnswered");
//        }
//        var timeUsed = getTimeUsedExpression(question, userData);
//        var answered = getAnswerExpression(question, userData, timeUsed, correctlyAnswered);
//        var questionStatistic = {
//            geolocation: geolocation,
//            person: person,
//            question:question,
//            quizling: quizling,
//            timeUsed: timeUsed,
//            game: "",
//            correctlyAnswered: answered.correctlyAnswered,
//            answered: answered.answer
//        };
//        score += getScoreExpression(timeUsed);
//        questionPersonalStatistics.push(questionStatistic);
//        totalTime += timeUsed;
//        totalQuestions++;
//        correctAnswerCount += answered.correctAnswerCount;
//    });
//    return {
//        completedQuizling: {
//            params: {
//                correctAnswers: correctAnswerCount,
//                endScore: score,
//                geolocation: geolocation,
//                totalQuestions: totalQuestions,
//                totalTime: totalTime,
//                quizlingId: questions[0].get("quizling").id
//            },
//            user: userData.get("user")
//        },
//        questionPersonalStatistics: questionPersonalStatistics
//    };
//}
//
//function getAnswerExpression(question, userData, timeUsed, answeredQuestion) {
//    if (timeUsed === 0) {
//        return  {
//            correctlyAnswered: false,
//            answer: TIME_OUT_TEXT,
//            correctAnswerCount: 0
//        };
//    }
//    var bonus = BONUS / MAX_PERCENTS + 1;
//    var IQ = (userData.get("IQ") ? (userData.get("IQ") * bonus >= MAX_IQ ? MAX_IQ : userData.get("IQ") * bonus) : DEFAULT_IQ * bonus);
//    var answers = question.get("answers");
//    var answer = question.get("correctAnswer");
//    var notCorrectAnswers = [];
//    for (var i = 0; i < answers.length; i++) {
//        if (answers[i] != answer) {
//            notCorrectAnswers.push(answers[i]);
//        }
//    }
//    if (answeredQuestion) {
//        return {
//            correctlyAnswered: true,
//            answer: answer,
//            correctAnswerCount: 1
//        };
//    } else {
//        if (Math.floor((MAX_PERCENTS * Math.random() + (MAX_PERCENTS - (MAX_PERCENTS - IQ) ))) <= MAX_PERCENTS) {
//            return {
//                correctlyAnswered: true,
//                answer: answer,
//                correctAnswerCount: 1
//            };
//        } else {
//            return {
//                correctlyAnswered: false,
//                answer: notCorrectAnswers[Math.floor(Math.random() * notCorrectAnswers.length)],
//                correctAnswerCount: 0
//            };
//        }
//    }
//}
//
//function getRandomArbitary(min, max)
//{
//    return Math.random() * (max - min) + min;
//}
//
//function getGeoPointExpression(userData) {
//    var latitude = userData.get("geo").latitude;
//    var longitude = userData.get("geo").longitude;
//    var randLatitude = parseFloat(getRandomArbitary(latitude - 1, latitude + 1).toFixed(4));
//    var randLongitude = parseFloat(getRandomArbitary(longitude - 1, longitude + 1).toFixed(4));
//    return new Parse.GeoPoint({latitude: randLatitude, longitude: randLongitude});
//}
//
//function getTimeUsedExpression(question, userData) {
//    var bonus = BONUS / MAX_PERCENTS + 1;
//    var readSpeed = (userData.get("readSpeed") ? (userData.get("readSpeed") * bonus >= MAX_READ_SPEED ? MAX_READ_SPEED : userData.get("readSpeed") * bonus) : DEFAULT_READ_SPEED * bonus);
//    var answersLength = 0;
//    for (var i = 0; i < question.get("answers").length; i++) {
//        answersLength += question.get("answers")[i].length;
//    }
//    var questionLength = (question.get("questionText").length);
//    var timeSpentReading = (questionLength + answersLength) / readSpeed;
//
//    var IQ = (userData.get("IQ") ? (userData.get("IQ") * bonus >= MAX_IQ ? MAX_IQ : userData.get("IQ") * bonus) : DEFAULT_IQ * bonus);
//    var luck = (userData.get("luck") ? (userData.get("luck") * bonus >= MAX_LUCK ? MAX_LUCK : userData.get("luck") * bonus) : DEFAULT_LUCK * bonus);
//
//    var timeThink = (((MAX_PERCENTS - luck) / MAX_PERCENTS) + ((MAX_PERCENTS - IQ) / MAX_PERCENTS )) * MAX_ANSWER_TIME;
//    var timeThinkRand = Math.floor(Math.random() * timeThink) + 1;
//    return (Math.floor(timeThinkRand + timeSpentReading) < MAX_ANSWER_TIME ? Math.floor(timeThinkRand + timeSpentReading) : 0);
//}
//
//function addNewQuestionPersonalStatistics(questionsAnswered, gameId) {
//    Parse.Cloud.useMasterKey();
//    var promises = [];
//    var Game = Parse.Object.extend("Game");
//    var game = new Parse.Query(Game);
//    game.equalTo("objectId", gameId);
//    return game.first()
//        .then(function(gameObject) {
//            _.each(questionsAnswered, function(answered) {
//                var QuestionPersonalStatistics = Parse.Object.extend("QuestionPersonalStatistics");
//                var query = new QuestionPersonalStatistics();
//                query.set("answered", answered.answered);
//                query.set("correctlyAnswered", answered.correctlyAnswered);
//                query.set("game", gameObject);
//                query.set("geolocation", answered.geolocation);
//                query.set("person", answered.person);
//                query.set("question", answered.question);
//                query.set("quizling", answered.quizling);
//                query.set("timeUsed", answered.timeUsed);
//                promises.push(query.save());
//            });
//            return Parse.Promise.when(promises);
//        });
//}
//
//function parseQuestions(/*array*/ qustions) {
//    var answers = [];
//    qustions.forEach(function(qustion) {
//        answers["answers"].push(qustion.get("answers"));
//        answers["correctAnswer"].push(qustion.get("correctAnswer"));
//    });
//    return Parse.Promise.as(answers);
//}
///**
// * Get all the questions available in quizling
// * @param quizling
// * @returns {*}
// */
//function getQuestions(/*object*/ quizling) {
//    console.log(["quizling in job", quizling.id]);
//    var query = new Parse.Query("Question");
//    query.equalTo("quizling", quizling);
//    query.ascending("order");
//    return query.find();
//}
//
///**
// * Scoring makes the logic
// * @param timeUsed
// * @returns {number}
// */
//function getScoreExpression(timeUsed) {
//    var score = Math.floor((MAX_ANSWER_TIME - timeUsed) * MAX_SCORE/MAX_ANSWER_TIME);
//    return (timeUsed > 0 ? score : 0);
//}